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
  let Token: any;
  const amount = '10000000000000000000000';

  beforeEach(async () => {
    [addr1, addr2, addr3] = await ethers.getSigners(); // addr3 is for the address that not in the tree
    const Airdrop = await ethers.getContractFactory('AirdropContract');
    const token = await ethers.getContractFactory('Dai');
    Token = await token.connect(addr1).deploy(amount);
    Contract = await Airdrop.connect(addr1).deploy(Token.address);

    await Token.mint(amount, Contract.address);
  });

  it("Should return the new greeting once it's changed", async () => {
    const whitelist = [
      {
        address: addr1.address,
      },
      {
        address: addr2.address,
      },
    ].map((item) => encodeMessage(item));
    console.log(addr1);
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

  it('only admin can call setMerkleRoot', async () => {
    const testRoot =
      '0x9026d8a85fee65817561c5d02b985f4e34a8f70d19b21f5382e13c646a71176b';
    await expect(
      Contract.connect(addr2).setMerkleRoot(testRoot)
    ).to.be.revertedWith('Only admin can call');
  });

  it('Eligible address control', async () => {
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
      encodeMessage({ address: addr2.address })
    );
    await Contract.connect(addr2).claim(proof);

    expect(await Token.balanceOf(addr2.address)).to.be.equal(100);
  });

  it('Eligible address control', async () => {
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
      encodeMessage({ address: addr2.address })
    );
    await expect(Contract.connect(addr3).claim(proof)).to.be.revertedWith(
      'Sender is not eligible to claim'
    );

    expect(await Token.balanceOf(addr2.address)).to.equal(0);
  });

  it('Eligible address control', async () => {
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
    expect(await Contract.connect(addr1).claim(proof))
      .to.emit(Contract, 'Transfer')
      .withArgs(addr1.address, 100);
  });
});
