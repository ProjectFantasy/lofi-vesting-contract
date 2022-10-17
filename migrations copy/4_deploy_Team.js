const generateMonthlyVestingStages = require('../utils/generate-vesting-stage')
const { BN } = require('openzeppelin-test-helpers')
const Vesting = artifacts.require('Vesting')
const vestingTokenAddr = process.env.VESTING_TOKEN
const beneficiary = '0x2513eDc56a2D0fB99668A0E755F355852c18F87b'
module.exports = async (deployer, network) => {
  if (network == 'develop') return

  const totalAmount = new BN(220000000)
  const times = new BN(5 * 12)
  const { vestingTimes, vestingAmounts } = await generateMonthlyVestingStages(
    totalAmount,
    times,
    new BN(Math.floor(Date.now() / 1000))
  )

  await deployer.deploy(Vesting, beneficiary, vestingTokenAddr, totalAmount)
  const vestingContract = await Vesting.deployed()
  await vestingContract.pushStages(vestingTimes, vestingAmounts)
}
