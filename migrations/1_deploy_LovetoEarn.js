const generateMonthlyVestingStages = require('../utils/generate-vesting-stage')
const { BN } = require('openzeppelin-test-helpers')
const Vesting = artifacts.require('Vesting')
const vestingTokenAddr = process.env.VESTING_TOKEN
const beneficiary = '0x057771B0f22F4153FAa91b1e8AeE530D52054C21'
module.exports = async (deployer, network) => {
  if (network == 'develop') return

  const totalAmount = new BN(300000000)
  const times = new BN(7 * 12)
  const { vestingTimes, vestingAmounts } = await generateMonthlyVestingStages(
    totalAmount,
    times,
    new BN(Math.floor(Date.now() / 1000))
  )

  await deployer.deploy(Vesting, beneficiary, vestingTokenAddr, totalAmount)
  const vestingContract = await Vesting.deployed()
  await vestingContract.pushStages(vestingTimes, vestingAmounts)
  await vestingContract.startVesting({ from: deployer })
}
