// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
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
    }

    // stakes tokens (deposit)
    function stakeTokens(uint256 _amount) public {
        // code goes here

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

    // issuing tokens
    function issueToken() public {
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }
}
