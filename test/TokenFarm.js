const TokenFarm = artifacts.require("TokenFarm")
const DappToken = artifacts.require("DappToken")
const DaiToken = artifacts.require("DaiToken")

require("chai")
  .use(require("chai-as-promised"))
  .should()

function tokens(n = "1000000") {
  return web3.utils.toWei(n, "Ether")
}

contract("TokenFarm", ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm
  before(async () => {
    daiToken = await DaiToken.new()
    dappToken = await DappToken.new()
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)
    // transfer all dapp tokens to farm
    await dappToken.transfer(tokenFarm.address, tokens())
    // send tokens to investor
    await daiToken.transfer(investor, tokens("100"), { from: owner })
  })
  describe("Mock DAI Deployment", async function() {
    it("has a name", async function() {
      const name = await daiToken.name()
      assert.equal(name, "Mock DAI Token")
    })
  })
  describe("Dapp Token deployment", async function() {
    it("has a name", async function() {
      const name = await dappToken.name()
      assert.equal(name, "DApp Token")
    })
  })
  describe("TokenFarm deployment", async function() {
    it("has a name", async function() {
      const name = await tokenFarm.name()
      assert.equal(name, "DaPP Token Farm")
    })
    it("has tokens", async function() {
      let balance = await dappToken.balanceOf(tokenFarm.address)
      assert.equal(balance.toString(), tokens())
    })
  })
  describe("Farming tokens", async function() {
    it("rewards investors for staking mDai tokens", async function() {
      let result
      // check investor balance before staking
      result = await daiToken.balanceOf(investor)
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor Mock DAI wallet balance correct before staking"
      )
      // stake mock DAI tokens
      await daiToken.approve(tokenFarm.address, tokens("100"), {
        from: investor,
      })
      await tokenFarm.stakeTokens(tokens("100"), { from: investor })

      // check staking result
      result = await daiToken.balanceOf(investor)
      assert.equal(
        result.toString(),
        tokens("0"),
        "Token farm mock DAI balance correct after staking"
      )

      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(
        result.toString(),
        tokens("100"),
        "Token farm Mock DAI balance correct after staking"
      )

      result = await tokenFarm.stakingBalance(investor)
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor staking balance correct after staking"
      )
      result = await tokenFarm.isStaking(investor)
      assert.equal(
        result.toString(),
        "true",
        "investor staking status correct after staking"
      )
      // Issue Token
      await tokenFarm.issueTokens({ from: owner })
      // check balance after issueance
      result = await dappToken.balanceOf(investor)
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor DApp Token wallet balance correct after issueance"
      )
      // ensure that only owner can issue tokens
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected

      // unstake the tokens
      await tokenFarm.unstakeTokens({ from: investor })
      result = await daiToken.balanceOf(investor)
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor mDai wallet balance correct after staking"
      )
      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(
        result.toString(),
        tokens("0"),
        "tokens form mDai balance correct after staking"
      )

      result = await tokenFarm.stakingBalance(investor)
      assert.equal(
        result.toString(),
        tokens("0"),
        "investor staking balance correct after staking"
      )

      result = await tokenFarm.isStaking(investor)
      assert.equal(
        result.toString(),
        "false",
        "investor staking status correct after staking"
      )
    })
  })
})
