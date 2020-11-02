const { assert } = require("chai");

const RetroToken = artifacts.require("RetroToken")
const DaiToken = artifacts.require("DaiToken")
const TokenFarm = artifacts.require("TokenFarm")

require("chai")
    .use(require("chai-as-promised"))
    .should()

function tokens(n){
    // converts (n) tokens
    return web3.utils.toWei(n, "Ether");
}

contract("TokenFarm", ([owner, investor]) => {
    let daiToken, retroToken, tokenFarm
    // TESTS
    before(async() =>{
        // Load deployed contracts
        daiToken = await DaiToken.new()
        retroToken = await RetroToken.new()
        tokenFarm = await TokenFarm.new(retroToken.address, daiToken.address)

        // xfer RETO to farm contract
        await retroToken.transfer(tokenFarm.address, tokens("1000000"))

        // send tokens back to theoretical investor
        await daiToken.transfer(investor, tokens("100"), {from: owner})

    })

    describe("Mock Dai deployment", async() => {
         // TEST CASE 1 Mock Dai
        it("has a name", async() =>{
            //let daiToken = await DaiToken.new()
            const name = await daiToken.name()
            assert.equal(name, "Mock DAI Token")
        })
    })

    describe("Retro Token deployment", async() => {
        // TEST CASE 1 Retro Token
        it("has a name", async() =>{
            //let daiToken = await DaiToken.new()
            const name = await retroToken.name()
            assert.equal(name, "Retro Token")
        })
    })

    describe("Token Farm deployment", async() => {
        // TEST CASE 1 Token Farm
        it("has a name", async() =>{
            let daiToken = await DaiToken.new()
            const name = await tokenFarm.name()
            assert.equal(name, "Retro Token Farm")
        })

        // TEST CASE 2 Token Farm
        it("contract has tokens", async() => {
            let balance = await retroToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens("1000000"))
        })
    })

    describe("Farming tokens", async() => {
        // TEST CASE -> balance before staking tokens, after, approval, status, issue
        it("rewards investors for staking mDAI tokens", async() =>{
            let result
            result = await daiToken.balanceOf(investor)
            // balance before
            assert.equal(result.toString(), tokens("100"), "investor mDAI wallet balance is correct before staking")

            // approval
            await daiToken.approve(tokenFarm.address, tokens("100"), {from: investor})

            // staked
            await tokenFarm.stakeTokens(tokens("100"), {from: investor})

            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens("0"), "investor mDAI wallet prior to staking")

            
            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens("100"), "Token farm mDAI balance after successfully staking")

            
            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens("100"), "investor staking balance after successfully staking")

            result = await tokenFarm.isStaked(investor)
            assert.equal(result.toString(), "true", "investor shows up as staking")

            // Test issuance of tokens
            await tokenFarm.issueTokens({from: owner})

            result = await retroToken.balanceOf(investor)
            assert.equal(result.toString(), tokens("100"), "investor's balance of RETRO is correct after issuance")

            // only owner cann issue tokens
            await tokenFarm.issueTokens({from: investor}).should.be.rejected;

            // withdraw tokens
            await tokenFarm.withdrawTokens({from: investor})

            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens("100"), "investor mDAI balance after withdrawing tokens")

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens("0"), "token farm contract balance after user unstakes")

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens("0"), "investor's staking balance after withdrawing tokens")


           
        })
    })


})
