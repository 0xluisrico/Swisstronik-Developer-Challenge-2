// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Storage {
    uint256 private varStorage;

    function updateVarStorage(uint256 _newNum) public {
        varStorage = _newNum;
    }

    function readVarStorage() public view returns(uint256) {
        return varStorage;
    }
}