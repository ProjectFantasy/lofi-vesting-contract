const { BN } = require('bn.js')
const { generateMonthlyVestingStagesInWei } = require('../utils/generate-vesting-stage')

generateMonthlyVestingStagesInWei(new BN(300000000), new BN(7 * 12), new BN(Math.floor(Date.now() / 1000))).then(
  ({ vestingTimes, vestingAmounts }) => {
    console.log(vestingTimes.map((v) => v.toString()))
    console.log(vestingAmounts.map((v) => v.toString()))
  }
)
