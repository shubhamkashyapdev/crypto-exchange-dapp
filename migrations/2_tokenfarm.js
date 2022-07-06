const TokenFarm = artifacts.require("TokenFarm")
const DappToken = artifacts.require("DappToken")
const DaiToken = artifacts.require("DaiToken")
module.exports = async function(deployer, network, accounts) {
  // deploy DaiToken
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()
  // deploy DappToken
  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()

  // deploy TokenFarm - pass dappToken address and daiToken address in constructor
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()

  // transfer some DappTokens to TokenFarm
  await dappToken.transfer(tokenFarm.address, "1000000000000000000000000")
  // we are treating the second account as investor and sending all daiTokens to that account
  await daiToken.transfer(accounts[1], "1000000000000000000000000")
}
