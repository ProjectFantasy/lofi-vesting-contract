const { BN } = require('bn.js')
const { generateMonthlyVestingStagesInWei } = require('../utils/generate-vesting-stage')
const moment = require('moment')
generateMonthlyVestingStagesInWei(new BN(300000000), new BN(7 * 12), new BN(Math.floor(Date.now() / 1000))).then(
  ({ vestingTimes, vestingAmounts }) => {
    console.log(vestingTimes.map((v) => v.toString()))
    console.log(vestingTimes.map((v) => moment.unix(v).format('DD-MM-YYYY HH:mm:ss')))
    console.log(vestingAmounts.map((v) => v.toString()))
  }
)
