//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

contract AirdropContract {
    address public owner;
    bytes32 merkleRoot;

    constructor(bytes32 _merkleRoot) {
        owner = msg.sender;
        merkleRoot = _merkleRoot;
    }
    
    // event call - when merkle root is changed 
    event MerkleChanged(bytes32 newMerkle);

    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }

    function getMerkleRoot() view external returns(bytes32 ) {
        return merkleRoot;
    }

    function _setMerkleRoot(bytes32 _merkleRoot) external onlyOwner  {
            merkleRoot = _merkleRoot;
            emit MerkleChanged(merkleRoot);
    }
}
