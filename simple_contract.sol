// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RequestCounter {
    uint public requestCount;

    function increment() public {
        requestCount += 1;
    }

    function getCount() public view returns (uint) {
        return requestCount;
    }
}