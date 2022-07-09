import React, { Component } from "react"
import dai from "../dai.png"
class Main extends Component {
  handleSubmit = (e) => {
    e.preventDefault()
    let amount
    amount = this.input.value.toString()
    amount = window.web3.utils.toWei(amount, "Ether")
    this.props.stakeTokens(amount)
  }
  render() {
    const { daiTokenBalance, dappTokenBalance, stakingBalance } = this.props

    return (
      <div id="content" className="mt-3">
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Staking Balance</th>
              <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {window.web3.utils.fromWei(this.props.stakingBalance, "Ether")}{" "}
                mDAI
              </td>
              <td>
                {window.web3.utils.fromWei(
                  this.props.dappTokenBalance,
                  "Ether"
                )}{" "}
                DAPP
              </td>
            </tr>
          </tbody>
        </table>
        <div className="card mb-4">
          <div className="card-body">
            <form className="mb-3" onSubmit={this.handleSubmit}>
              <div>
                <label className="float-left">
                  <b>Stake Tokens</b>
                </label>
                <span className="float-right text-muted">
                  Balance:{" "}
                  {window.web3.utils.fromWei(
                    this.props.daiTokenBalance,
                    "Ether"
                  )}{" "}
                </span>
              </div>
              <div
                style={{ display: "flex", width: "100%", margin: "10px 0px" }}
              >
                <input
                  type="text"
                  ref={(input) => {
                    this.input = input
                  }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={dai} height="32" alt="" /> &nbsp; &nbsp;&nbsp;
                    mDAI
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
              >
                STAKE
              </button>
            </form>
            <button
              onClick={(e) => {
                this.props.unstakeTokens()
              }}
              className="btn btn-primary btn-block btn-sm"
            >
              UNSTAKE
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Main
