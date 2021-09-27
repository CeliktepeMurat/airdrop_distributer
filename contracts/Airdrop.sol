//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';

// import "hardhat/console.sol";

contract AirdropContract {
    address public owner;
    bytes32 merkleRoot;

    constructor() {
        owner = msg.sender;
    }
    
    // event call - when merkle root is changed 
    event MerkleChanged(bytes32 newMerkle);

    modifier onlyOwner {
        require(owner == msg.sender,'Only admin can call');
        _;
    }

    function getMerkleRoot() view external returns(bytes32 ) {
        return merkleRoot;
    }

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner  {
        merkleRoot = _merkleRoot;
        emit MerkleChanged(merkleRoot);
    }

    // Verify function 
    // @params _proof as calldata
    // verifys msg.sender is in the tree or not
    // emit verify event

    function verify(bytes32[] calldata _proof) external view returns (bool) {
        bytes32 leaf = keccak256(abi.encode(msg.sender));
        return MerkleProof.verify(_proof, merkleRoot, leaf);
    } 
}
