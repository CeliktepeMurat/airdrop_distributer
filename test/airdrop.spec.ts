import { expect, use } from 'chai';
import { solidity } from 'ethereum-waffle';
import { utils } from 'ethers';
import { ethers } from 'hardhat';
import {
  buildMerkleTree,
  getMerkleRoot,
  getProofForLeaf,
} from '../scripts/MerkleTreeUtils';

use(solidity);

const encodeMessage = (message: { address: string }) => {
  const encoder = new utils.AbiCoder();
  return encoder.encode(['address'], [message.address]);
};

describe('Airdrop Contract', () => {
  let addr1: any, addr2: any, addr3: any;
  let Contract: any;

  beforeEach(async () => {
    [addr1, addr2, addr3] = await ethers.getSigners(); // addr3 is for the address that not in the tree
    const Airdrop = await ethers.getContractFactory('AirdropContract');

    Contract = await Airdrop.connect(addr1).deploy();
  });

  it("Should return the new greeting once it's changed", async function () {
    const whitelist = [
      {
        address: addr1.address,
      },
      {
        address: addr2.address,
      },
    ].map((item) => encodeMessage(item));

    const tree = buildMerkleTree(whitelist);
    const root = getMerkleRoot(tree);

    await Contract.setMerkleRoot(root);

    expect(await Contract.getMerkleRoot()).to.equal(root);
  });

  it('should return true', async () => {
    const whitelist = [
      {
        address: addr1.address,
      },
      {
        address: addr2.address,
      },
    ].map((item) => encodeMessage(item));

    const tree = buildMerkleTree(whitelist);
    const root = getMerkleRoot(tree);

    await Contract.setMerkleRoot(root);

    const proof = getProofForLeaf(
      tree,
      encodeMessage({ address: addr1.address })
    );
    expect(await Contract.connect(addr1).verify(proof)).to.equal(true);
  });

  it('should revert if wrong address try to call', async () => {
    const whitelist = [
      {
        address: addr1.address,
      },
      {
        address: addr2.address,
      },
    ].map((item) => encodeMessage(item));

    const tree = buildMerkleTree(whitelist);
    const root = getMerkleRoot(tree);

    await Contract.setMerkleRoot(root);

    const proof = getProofForLeaf(
      tree,
      encodeMessage({ address: addr1.address })
    );
    expect(await Contract.connect(addr3).verify(proof)).to.equal(false);
  });

  it('should revert if wrong proof pass', async () => {
    const whitelist = [
      {
        address: addr1.address,
      },
      {
        address: addr2.address,
      },
    ].map((item) => encodeMessage(item));

    const tree = buildMerkleTree(whitelist);
    const root = getMerkleRoot(tree);

    await Contract.setMerkleRoot(root);

    const proof = getProofForLeaf(
      tree,
      encodeMessage({ address: addr3.address })
    );
    expect(await Contract.connect(addr3).verify(proof)).to.equal(false);
  });

  it('only admin can call setMerkleRoot', async function () {
    const testRoot =
      '0x9026d8a85fee65817561c5d02b985f4e34a8f70d19b21f5382e13c646a71176b';
    await expect(
      Contract.connect(addr2).setMerkleRoot(testRoot)
    ).to.be.revertedWith('Only admin can call');
  });
});
