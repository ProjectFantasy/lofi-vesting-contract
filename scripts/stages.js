const { BN } = require('bn.js')
const { generateMonthlyVestingStages, generateMonthlyVestingStagesInWei } = require('../utils/generate-vesting-stage')
const moment = require('moment')
const fs = require('fs')

const generateStagesInWei = () => {
  generateMonthlyVestingStagesInWei(new BN(300000000), new BN(7 * 12), new BN(Math.floor(Date.now() / 1000))).then(
    ({ vestingTimes, vestingAmounts }) => {
      console.log(vestingTimes.map((v) => v.toString()))
      console.log(vestingTimes.map((v) => moment.unix(v).format('DD-MM-YYYY HH:mm:ss')))
      console.log(vestingAmounts.map((v) => v.toString()))
    }
  )
}

const generateStages = (totalAmount, times, file) => {
  generateMonthlyVestingStages(
    totalAmount,
    times,
    moment
      .unix(new BN(Math.floor(Date.now() / 1000)))
      .add(10, 'days')
      .unix()
  ).then(({ vestingTimes, vestingAmounts }) => {
    let content = ''
    content = content + 'Date time,Timestamp,Amount' + '\n'
    for (let i = 0; i < vestingTimes.length; i++) {
      const time = vestingTimes[i]
      const amount = vestingAmounts[i]
      // console.log(moment.unix(time).format('DD-MM-YYYY HH:mm:ss') + ',' + time.toString() + ',' + amount.toString())

      content =
        content +
        moment.unix(time).format('DD-MM-YYYY HH:mm:ss') +
        ',' +
        time.toString() +
        ',' +
        amount.toString() +
        '\n'
    }
    fs.writeFileSync(file, content)
  })
}
generateStages(new BN(380000000), new BN(7 * 12), './notes/love_2_earn.csv')
generateStages(new BN(230000000), new BN(7 * 12), './notes/marketing.csv')
generateStages(new BN(170000000), new BN(5 * 12), './notes/team.csv')
generateStages(new BN(20000000), new BN(3 * 12), './notes/advisor.csv')
generateStages(new BN(50000000), new BN(7 * 12), './notes/reserved.csv')
