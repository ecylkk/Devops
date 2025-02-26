// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIRequestCounter {
    uint public requestCount;
    mapping(address => uint) public userRequests;
    event RequestMade(address indexed user, uint count, string response);

    function logRequest(string memory response) public {
        requestCount++;
        userRequests[msg.sender]++;
        emit RequestMade(msg.sender, requestCount, response);
    }

    function getUserCount(address user) public view returns (uint) {
        return userRequests[user];
    }
}