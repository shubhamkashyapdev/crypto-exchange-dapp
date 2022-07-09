import React, { Component } from "react"
import Navbar from "./Navbar"
import "./App.css"
import Web3 from "web3"
import DaiToken from "../abis/DaiToken.json"
import DappToken from "../abis/DappToken.json"
import TokenFarm from "../abis/TokenFarm.json"
import Main from "./Main"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: "0x0",
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: "0",
      dappTokenBalance: "0",
      stakingBalance: "0",
      loading: true,
    }
  }

  async componentWillMount() {
    this.loadWeb3()
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkID = await web3.eth.net.getId()
    // load daiTokens
    const daiTokenData = DaiToken.networks[networkID]
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods
        .balanceOf(this.state.account)
        .call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString() })
      console.log({
        daiTokenBalance: web3.utils.fromWei(daiTokenBalance, "Ether"),
      })
    } else {
      window.alert("DaiToken contract not deployed to detected network")
    }

    //load dappTokens
    const dappTokenData = DappToken.networks[networkID]
    if (dappTokenData) {
      const dappToken = new web3.eth.Contract(
        DappToken.abi,
        dappTokenData.address
      )
      this.setState({ dappToken })
      const dappTokenBalance = await dappToken.methods
        .balanceOf(this.state.account)
        .call()
      this.setState({ dappTokenBalance: dappTokenBalance.toString() })
      console.log({
        dappTokenBalance: web3.utils.fromWei(dappTokenBalance, "Ether"),
      })
    } else {
      window.alert("DappToken contract not deployed to detected network")
    }

    // load tokenFarm
    const tokenFarmData = TokenFarm.networks[networkID]
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(
        TokenFarm.abi,
        tokenFarmData.address
      )
      this.setState({ tokenFarm })
      const stakingBalance = await tokenFarm.methods
        .stakingBalance(this.state.account)
        .call()
      this.setState({ stakingBalance: stakingBalance.toString() })
      console.log({
        stakingBalance: web3.utils.fromWei(stakingBalance, "Ether"),
      })
    } else {
      window.alert("TokenFarm contract is not deployed to detected network")
    }

    // set loading to false
    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ehtereum) {
      window.web3 = new Web3(window.ehtereum)
      await window.ehtereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert("Please install MetaMask!!")
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods
      .approve(this.state.tokenFarm._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", () => {
        this.state.tokenFarm.methods
          .stakeTokens(amount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false })
          })
      })
  }

  unstakeTokens = () => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods
      .unstakeTokens()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false })
      })
  }

  render() {
    let content
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      )
    } else {
      content = (
        <Main
          daiTokenBalance={this.state.daiTokenBalance}
          dappTokenBalance={this.state.dappTokenBalance}
          stakingBalance={this.state.stakingBalance}
          stakeTokens={this.stakeTokens}
          unstakeTokens={this.unstakeTokens}
        />
      )
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>

                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default App
