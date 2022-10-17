const { BN } = require('openzeppelin-test-helpers')

const moment = require('moment')

async function generateMonthlyVestingStages(totalAmount, times, initStartVestingTime) {
  const amountEachTime = totalAmount.div(times)
  const lastAmount = totalAmount.sub(amountEachTime.mul(times.sub(new BN(1))))

  const vestingTimes = []
  const vestingAmounts = []
  const startVestingTime = new BN(initStartVestingTime)

  for (let i = 0; i < times; i++) {
    const vestingTime = new BN(moment.unix(startVestingTime).add(i, 'month').unix())
    let vestingAmount = amountEachTime
    if (i == times - 1) {
      vestingAmount = lastAmount
    }
    vestingTimes.push(vestingTime)
    vestingAmounts.push(vestingAmount)
  }
  return { vestingTimes, vestingAmounts }
}

async function generateMonthlyVestingStagesInWei(totalAmount, times, initStartVestingTime) {
  const { vestingTimes, vestingAmounts } = await generateMonthlyVestingStages(totalAmount, times, initStartVestingTime)

  return { vestingTimes, vestingAmounts: vestingAmounts.map((v) => v.mul(new BN('1000000000000000000'))) }
}

module.exports = { generateMonthlyVestingStages, generateMonthlyVestingStagesInWei }
