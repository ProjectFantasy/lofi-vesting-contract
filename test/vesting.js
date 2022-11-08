const { expect } = require('chai')
const { constants, time, BN, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
// const { web3 } = require('openzeppelin-test-helpers/src/setup')
const { generateMonthlyVestingStagesInWei } = require('../utils/generate-vesting-stage')
const Token20 = artifacts.require('mocks/Token20')
const Vesting = artifacts.require('Vesting')

contract('Vesting', ([deployer, beneficiary]) => {
  let vesting, token

  before(async () => {
    // await time.advanceBlock()
  })
  beforeEach('Deploy contracts', async () => {
    token = await Token20.new('TestToken', 'TToken', 18, web3.utils.toWei('1000000000', 'ether'), { from: deployer })
    vesting = await Vesting.new(beneficiary, token.address, web3.utils.toWei('300000000', 'ether'), { from: deployer })
    await token.transfer(vesting.address, web3.utils.toWei('300000000', 'ether'), { from: deployer })
  })

  doVesting = async (totalAmount, times) => {
    const { vestingTimes, vestingAmounts } = await generateMonthlyVestingStagesInWei(
      totalAmount,
      times,
      (await time.latest()).add(time.duration.seconds(100))
    )
    await vesting.pushStages(vestingTimes, vestingAmounts, { from: deployer })
    const stages = await vesting.getStages({ from: deployer })
    for (let i = 0; i < stages.length; i++) {
      const vestingTime = stages[i].releaseTime
      const amount = stages[i].amount
      expect(new BN(vestingTime)).to.be.bignumber.equal(vestingTimes[i])
      expect(new BN(amount)).to.be.bignumber.equal(new BN(vestingAmounts[i]))
    }
    await vesting.startVesting({ from: deployer })
    let accBalance = new BN(0)
    for (let i = 0; i < vestingTimes.length; i++) {
      const vestingTime = vestingTimes[i]
      const amount = vestingAmounts[i]
      await time.increaseTo(vestingTime)
      await vesting.release({ from: beneficiary })
      const balance = await token.balanceOf(beneficiary)
      accBalance = accBalance.add(amount)
      expect(new BN(balance)).to.be.bignumber.equal(accBalance)
    }
    expect(accBalance).to.be.bignumber.equal(web3.utils.toWei(totalAmount, 'ether'))
    const remainingAmount = await vesting.getAvailableAmount()
    expect(new BN(remainingAmount)).to.be.bignumber.equal(new BN(0))
  }
  describe('vesting', async () => {
    it('test Simple vesting', async () => {
      const vestingTimes = []
      const vestingAmounts = []
      for (let i = 0; i < 10; i++) {
        const vestingTime = (await time.latest()).add(time.duration.seconds((i + 1) * 100))
        const vestingAmount = 100
        vestingTimes.push(vestingTime)
        vestingAmounts.push(vestingAmount)
      }
      await vesting.pushStages(vestingTimes, vestingAmounts, { from: deployer })
      const stages = await vesting.getStages({ from: deployer })
      for (let i = 0; i < stages.length; i++) {
        const vestingTime = stages[i].releaseTime
        const amount = stages[i].amount
        expect(new BN(vestingTime)).to.be.bignumber.equal(vestingTimes[i])
        expect(new BN(amount)).to.be.bignumber.equal(new BN(vestingAmounts[i]))
      }
      await vesting.startVesting({ from: deployer })
      let accBalance = 0
      for (let i = 0; i < vestingTimes.length; i++) {
        const vestingTime = vestingTimes[i]
        const amount = vestingAmounts[i]
        await time.increaseTo(vestingTime)
        await vesting.release({ from: beneficiary })
        const balance = await token.balanceOf(beneficiary)
        accBalance += amount
        expect(new BN(balance)).to.be.bignumber.equal(new BN(accBalance))
      }
      const remainingAmount = await vesting.getAvailableAmount()
      expect(new BN(remainingAmount)).to.be.bignumber.equal(new BN(0))
    })

    it('test LovetoEarn Vesting', async () => {
      const totalAmount = new BN(300000000)

      const times = new BN(7 * 12)

      await doVesting(totalAmount, times)
    })

    it('test Marketing Vesting', async () => {
      const totalAmount = new BN(280000000)
      const times = new BN(7 * 12)

      await doVesting(totalAmount, times)
    })

    it('test Sale Vesting', async () => {
      const totalAmount = new BN(100000000)
      const times = new BN(1 * 12)
      await doVesting(totalAmount, times)
    })

    it('test Team Vesting', async () => {
      const totalAmount = new BN(220000000)
      const times = new BN(5 * 12)
      await doVesting(totalAmount, times)
    })

    it('test Advisor Vesting', async () => {
      const totalAmount = new BN(50000000)
      const times = new BN(3 * 12)
      await doVesting(totalAmount, times)
    })

    it('test Reserve Vesting', async () => {
      const totalAmount = new BN(50000000)
      const times = new BN(7 * 12)
      await doVesting(totalAmount, times)
    })

    it('test reset stages', async () => {
      const vestingTimes = []
      const vestingAmounts = []
      for (let i = 0; i < 10; i++) {
        const vestingTime = (await time.latest()).add(time.duration.seconds((i + 1) * 100))
        const vestingAmount = 100

        vestingTimes.push(vestingTime)
        vestingAmounts.push(vestingAmount)
      }

      await vesting.pushStages(vestingTimes, vestingAmounts, { from: deployer })

      let stages = await vesting.getStages({ from: deployer })
      for (let i = 0; i < stages.length; i++) {
        const vestingTime = stages[i].releaseTime
        const amount = stages[i].amount

        expect(new BN(vestingTime)).to.be.bignumber.equal(vestingTimes[i])
        expect(new BN(amount)).to.be.bignumber.equal(new BN(vestingAmounts[i]))
      }

      await vesting.resetStages({ from: deployer })

      stages = await vesting.getStages({ from: deployer })

      expect(stages.length).equal(0)
      await vesting.pushStages(vestingTimes, vestingAmounts, { from: deployer })

      await vesting.startVesting({ from: deployer })

      let accBalance = 0
      for (let i = 0; i < vestingTimes.length; i++) {
        const vestingTime = vestingTimes[i]
        const amount = vestingAmounts[i]
        await time.increaseTo(vestingTime)
        await vesting.release({ from: beneficiary })
        const balance = await token.balanceOf(beneficiary)
        accBalance += amount
        expect(new BN(balance)).to.be.bignumber.equal(new BN(accBalance))
      }
      const remainingAmount = await vesting.getAvailableAmount()
      expect(new BN(remainingAmount)).to.be.bignumber.equal(new BN(0))
    })
    it('should be revert if there is not enought balance when starting vesting', async () => {
      await vesting.setTotalAmount(web3.utils.toWei('400000000', 'ether'))
      const vestingTimes = []
      const vestingAmounts = []
      for (let i = 0; i < 10; i++) {
        const vestingTime = (await time.latest()).add(time.duration.seconds((i + 1) * 100))
        const vestingAmount = 100
        vestingTimes.push(vestingTime)
        vestingAmounts.push(vestingAmount)
      }
      await vesting.pushStages(vestingTimes, vestingAmounts, { from: deployer })
      const stages = await vesting.getStages({ from: deployer })
      for (let i = 0; i < stages.length; i++) {
        const vestingTime = stages[i].releaseTime
        const amount = stages[i].amount
        expect(new BN(vestingTime)).to.be.bignumber.equal(vestingTimes[i])
        expect(new BN(amount)).to.be.bignumber.equal(new BN(vestingAmounts[i]))
      }

      await expectRevert(vesting.startVesting({ from: deployer }), 'Not enough balance')
    })

    it('should be successful when transfering out the token before locked', async () => {
      expect(new BN(await token.balanceOf(vesting.address))).to.be.bignumber.equal(
        web3.utils.toWei('300000000', 'ether')
      )
      const preDeployerBalance = await token.balanceOf(deployer)
      await vesting.transfer(deployer, web3.utils.toWei('100000000', 'ether'), { from: deployer })
      expect(await token.balanceOf(vesting.address)).to.be.bignumber.equal(web3.utils.toWei('200000000', 'ether'))

      const postDeployerBalance = await token.balanceOf(deployer)
      expect(postDeployerBalance.sub(preDeployerBalance)).to.be.bignumber.equal(web3.utils.toWei('100000000', 'ether'))
    })
  })
})
