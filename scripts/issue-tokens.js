const TokenFarm = artifacts.require("TokenFarm")

module.exports = async function(callaback) {
  let tokenFarm = await TokenFarm.deployed()
  await tokenFarm.issueTokens()
  console.log("Tokens Issued :) ")
  callaback()
}
