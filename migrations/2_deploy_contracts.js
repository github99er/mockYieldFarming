const RetroToken = artifacts.require("RetroToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {
    // Deploy mDAI
    await deployer.deploy(DaiToken);
    const daiToken = await DaiToken.deployed()
    // Deploy RETRO
    await deployer.deploy(RetroToken);
    const retroToken = await RetroToken.deployed()
    // Deploy farming contract
    await deployer.deploy(TokenFarm, retroToken.address, daiToken.address);
    const tokenFarm= await TokenFarm.deployed()
    // Transfer all RETRO to farming contract
    await retroToken.transfer(tokenFarm.address, "1000000000000000000000000");
    // Transfer mDAI to theoretical investor
    await daiToken.transfer(accounts[1], "1000000000000000000000000");  
};
