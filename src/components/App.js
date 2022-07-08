import React, { Component } from "react"
import Navbar from "./Navbar"
import "./App.css"
import Web3 from "web3"
import DaiToken from "../abis/DaiToken.json"
import DappToken from "../abis/DappToken.json"

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
    this.setState({ ...this.state, account: accounts[0] })

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

  render() {
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

                <h1>Hello, World!</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default App
