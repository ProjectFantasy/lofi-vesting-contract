const { BN } = require('openzeppelin-test-helpers')
const moment = require('moment')

async function generateMonthlyVestingStages(totalAmount, times, initStartVestingTime) {
  const amountEachTime = totalAmount.div(times)
  const lastAmount = totalAmount.sub(amountEachTime.mul(times.sub(new BN(1))))

  const vestingTimes = []
  const vestingAmounts = []
  const startVestingTime = new BN(initStartVestingTime)

  const vestLogs = []
  for (let i = 0; i < times; i++) {
    const vestingTime = new BN(
      moment
        .unix(startVestingTime)
        .add(i + 1, 'month')
        .unix()
    )
    let vestingAmount = web3.utils.toWei(amountEachTime, 'ether')
    if (i == times - 1) {
      vestingAmount = web3.utils.toWei(lastAmount, 'ether')
    }
    vestingTimes.push(vestingTime)
    vestingAmounts.push(vestingAmount)

    vestLogs.push({
      time: moment.unix(vestingTime).format('DD-MM-YYYY HH:mm:ss'),
      timestamp: vestingTime.toString(),
      amount: web3.utils.fromWei(vestingAmount, 'ether'),
    })
  }
  // console.table(vestLogs)
  // console.log('log.time ' + ', ' + 'log.timestamp' + ', ' + 'log.amount')
  // vestLogs.forEach((log) => {
  //   console.log(log.time + ', ' + log.timestamp + ', ' + log.amount)
  // })

  return { vestingTimes, vestingAmounts }
}

module.exports = generateMonthlyVestingStages
