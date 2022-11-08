const { generateMonthlyVestingStagesInWei } = require('../utils/generate-vesting-stage')
const { BN } = require('openzeppelin-test-helpers')
const Vesting = artifacts.require('Vesting')
const vestingTokenAddr = process.env.VESTING_TOKEN
const beneficiary = '0x1a3927727fD53139a7E17A4487f82704D8be7c3f'
module.exports = async (deployer, network) => {
  if (network == 'develop') return

  const totalAmount = new BN(230000000)
  const times = new BN(7 * 12)
  const { vestingTimes, vestingAmounts } = await generateMonthlyVestingStagesInWei(
    totalAmount,
    times,
    new BN(Math.floor(Date.now() / 1000))
  )

  await deployer.deploy(Vesting, beneficiary, vestingTokenAddr, totalAmount)
  const vestingContract = await Vesting.deployed()
  await vestingContract.pushStages(vestingTimes, vestingAmounts)
}
