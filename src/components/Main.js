import React, { Component } from 'react'
import dai from '../dai.png'

class Main extends Component {

  render() {
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
              <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mDAI</td>
              <td>{window.web3.utils.fromWei(this.props.retroTokenBalance, 'Ether')} RETRO</td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-4"style={{ backgroundColor: "transparent", borderStyle: "none" }} >

          <div className="card-body"style={{ backgroundColor: "transparent", borderStyle: "none"}}>

            <form className="mb-3" style={{ backgroundColor: "transparent", borderStyle: "none" }} onSubmit={(event) => {
                event.preventDefault()
                let amount
                amount = this.input.value.toString()
                amount = window.web3.utils.toWei(amount, 'Ether')
                this.props.stakeTokens(amount)
              }}>
              <div>
                <label className="float-left"><b style={{ color: "aqua" }}>Stake Tokens</b></label>
                <span className="float-right" style={{color: "hotpink"}}>
                  Balance: {window.web3.utils.fromWei(this.props.daiTokenBalance, 'Ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                 style={{
                    color: "white",
                    height: "80px",
                    backgroundColor: "aqua"
                  }}
                  type="text"
                  ref={(input) => { this.input = input }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={dai} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; mDAI
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg"  style={{
                  backgroundColor: "hotpink",
                  border: "2px solid hotpink"
                }}>STAKE!</button>
            </form>
            <button
              type="submit"
              className="btn btn- btn-block btn-sm"
              style={{ color: "white", border: "2px solid hotpink" }}
              onClick={(event) => {
                event.preventDefault()
                this.props.unstakeTokens()
              }}>
                UN-STAKE...
              </button>
          </div>
        </div>

      </div>
    );
  }
}

export default Main;

