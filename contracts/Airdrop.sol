//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

contract AirdropContract {
    address public owner;
    string merkleRoot;

    constructor(string memory _merkleRoot) {
        owner = msg.sender;
        merkleRoot = _merkleRoot;
    }
    
    // event call - when merkle root is changed 
    event MerkleChanged(string oldMerkle,string newMerkle);

    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }

    function getMerkleRoot() view public returns(string memory) {
        return merkleRoot;
    }

    function setMerkleRoot(string memory _merkleRoot) public onlyOwner  {
            emit MerkleChanged(merkleRoot,_merkleRoot);
            merkleRoot = _merkleRoot;
    }
}
