import React, { Component } from 'react'
import DaiToken from "../abis/DaiToken.json"
import RetroToken from "../abis/RetroToken.json"
import TokenFarm from "../abis/TokenFarm.json"
import Web3 from "web3"
import Main from "./Main.js"
import soundfile from "./party.mp3";
import "./App.scss"
import './App.css'


class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
   
    //console.log(accounts)
   
    this.setState({account: accounts[0]})

    // detect network
    const networkId = await web3.eth.net.getId()
    //console.log(networkId)

    // load mDAI token
    const daiTokenData =  DaiToken.networks[networkId]
    if(daiTokenData){
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({daiToken})
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({daiTokenBalance: daiTokenBalance.toString()})
      console.log({balance: daiTokenBalance})
    }

    else {
      window.alert("mDAI Token contract not deployed to detected network!")
      }

    // load Retro Token
    const retroTokenData =  RetroToken.networks[networkId]
    if(retroTokenData){
      const retroToken = new web3.eth.Contract(RetroToken.abi, retroTokenData.address)
      this.setState({retroToken})
      let retroTokenBalance = await retroToken.methods.balanceOf(this.state.account).call()
      this.setState({retroTokenBalance: retroTokenBalance.toString()})
      console.log({balance: retroTokenBalance})
    }

    else {
      window.alert("Retro Token contract not deployed to detected network!")
      }

    // load Token Farm Contract
    const tokenFarmData =  TokenFarm.networks[networkId]
    if(tokenFarmData){
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      this.setState({tokenFarm})
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
      this.setState({stakingBalance: stakingBalance.toString()})
          }

    else {
      window.alert("Token Farm contract not deployed to detected network!")
      }
    
    this.setState({loading: false})
  
  }


  // CONNECT APP TO BLOCKCHAIN
  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert("Non-ethereum browser detected. You should consider trying MetaMask!")
    }
  }

  // STAKE TOKENS
  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  // UNSTAKE TOKENS
  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.withdrawTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      retroToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      retroTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading){
      content = <p id="loader" className="text-center">Loading...</p>
    }
    else{
      content = <Main
      daiTokenBalance={this.state.daiTokenBalance}
      retroTokenBalance={this.state.retroTokenBalance}
      stakingBalance={this.state.stakingBalance}
      stakeTokens={this.stakeTokens}
      unstakeTokens={this.unstakeTokens}/>
    }
    return (
      <div id="content" className="mt-3">
        <div class="container2">
          <div class="topleft">
            {" "}
            <audio controls loop style={{ backgroundColorL: "hotpink" }}>
              <source src={soundfile} type="audio/mp3" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>
        <div class="container browser-frame center">
          <div id="drag-handle"></div>
          <main class="content">
            <div class="couldnt-do-this-in-the-90s">
              <img
                src="https://media1.giphy.com/media/xUOwGpxY8pDLO40OVG/giphy.gif?cid=ecf05e47cg0vldq0psc52s4b8mtwifsipm48vdvpotulhfe0&rid=giphy.gif"
                alt="fun!"
              />
              <h1>IT'S STAKING TIME!</h1>
              <img
                src="https://media1.giphy.com/media/xUOwGpxY8pDLO40OVG/giphy.gif?cid=ecf05e47cg0vldq0psc52s4b8mtwifsipm48vdvpotulhfe0&rid=giphy.gif"
                alt="fun!"
              />
            </div>

            <p>
              See the Code:{" "}
              <a target="_blank" href="https://github.com/github99er/mockYieldFarming">
                Gituhb
              </a>
            </p>
            {content}
          
          </main>
        </div>
      </div>
    );
  }
}

export default App;
