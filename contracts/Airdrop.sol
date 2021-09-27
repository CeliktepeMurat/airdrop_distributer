//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol';



contract AirdropContract   {
    using SafeERC20 for IERC20Metadata;
    IERC20Metadata Token;


    
    address public owner;
    bytes32 merkleRoot;
    uint256 TokenAmount = 100;

    constructor(IERC20Metadata token) {
        owner = msg.sender;
        Token = token;
    }
    
    // event call - when merkle root is changed 
    event MerkleChanged(bytes32 newMerkle);
    event Transfer(address to , uint amount);

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

    function verify(bytes32[] calldata _proof) public view returns (bool) {
        bytes32 leaf = keccak256(abi.encode(msg.sender));
        return MerkleProof.verify(_proof, merkleRoot, leaf);
    } 

    // call verify function and require it returns true
    // if user is in the tree, call _transfer method and transfer TokenAmount to the user
    // emit transfer event in _transfer function
    function claim(bytes32[] calldata _proof) external{
        require(verify(_proof),'Sender is not eligible to claim');
        _transfer(msg.sender,100);
    }
    function _transfer(address _to, uint256 _amount) internal  {
        Token.transfer(_to,_amount);
        emit Transfer(_to,_amount);
    }
}
