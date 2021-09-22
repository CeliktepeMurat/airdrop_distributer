import { expect } from 'chai';
import { ethers } from 'hardhat';
import { getMerkleRoot, getMerkleTree } from '../scripts/MerkleTreeUtils';

describe('Airdrop Contract', () => {
  let addr1: any, addr2: any, addr3: any;
  let Contract: any;

  const merkleTree = getMerkleTree();
  const root = getMerkleRoot(merkleTree);

  beforeEach(async () => {
    [addr1, addr2, addr3] = await ethers.getSigners(); // addr3 is for the address that not in the tree
    const Airdrop = await ethers.getContractFactory('AirdropContract');

    Contract = await Airdrop.connect(addr1).deploy(root);
  });

  it("Should return the new greeting once it's changed", async function () {
    await Contract.setMerkleRoot(root);

    expect(await Contract.getMerkleRoot()).to.equal(root);
  });
});
