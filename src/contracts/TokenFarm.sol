pragma solidity ^0.5.0;

import "./RetroToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Retro Token Farm";
    RetroToken public retroToken; // state variable
    DaiToken public daiToken; // state variable
    address public owner;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;

    constructor(RetroToken _retroToken, DaiToken _daiToken) public {
        retroToken = _retroToken; // retroToken contract address
        daiToken = _daiToken; // daiToken contract address
        owner = msg.sender;


    }

    // Stake tokens
    function stakeTokens(uint _amount) public {
        // Require staked amount to be > 0 
        require(_amount > 0, "amount must be greater than 0");
        // Intract with Mock Dai Contract
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Staked balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // prevent double issuance of tokens to stakers
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        // Staked verification
        isStaked[msg.sender] = true;
        hasStaked[msg.sender] = true;
        
    }

    // Unstake tokens
    function withdrawTokens() public {
        // identify staked balance
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "cannot withdraw 0 tokens");
        
        // xfer staking rewards to contract
        daiToken.transfer(msg.sender, balance);

        // reset staking balance
        stakingBalance[msg.sender] = 0;

        // reset staking status
        isStaked[msg.sender] = false;


    }

    // Issue tokens
    function issueTokens() public{
        require(msg.sender == owner, "to call the function you must be the owner");
        // For every address that is staked in the token farm fetch their balance and send them equivalent RETRO
        for (uint i=0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                 retroToken.transfer(recipient, balance);
            }

        }
    }

}

