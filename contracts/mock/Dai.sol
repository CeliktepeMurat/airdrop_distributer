// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Dai is ERC20 {
  constructor(uint256 amount) ERC20('DAI', 'DAI') {
    _mint(msg.sender,amount); 
  }

  function mint(uint256 amount, address owner) public {
    _mint(owner,amount);
  }

}