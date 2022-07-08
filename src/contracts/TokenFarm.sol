// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    address public owner;
    string public name = "DaPP Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    address[] public stakers;

    constructor(DappToken _dappToken, DaiToken _daiToken) {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // stakes tokens (deposit)
    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "ammount must be greater than 0");

        // transfer mock dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // update stakingBalance
        stakingBalance[msg.sender] += _amount;

        // add user to staker array of they haven't staked already
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        // update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // unstaking tokens (withdraw)
    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "staking balance cannot be 0");

        // transfer mDai tokens to this msg.sender for stakng
        daiToken.transfer(msg.sender, balance);

        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }

    // issuing tokens
    function issueTokens() public {
        require(msg.sender == owner, "caller must be owner");
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }
}
