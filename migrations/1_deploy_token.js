const LOLOToken = artifacts.require('LOLOToken')
const tokenReceiver = process.env.TOKEN_RECEIVER
module.exports = async (deployer, network) => {
  if (network == 'develop') return

  await deployer.deploy(LOLOToken, tokenReceiver)
  await LOLOToken.deployed()
}
