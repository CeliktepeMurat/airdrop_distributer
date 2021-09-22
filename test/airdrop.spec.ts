import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  getMerkleRoot,
  getMerkleTree,
  getProof,
  ADDRESS,
} from '../scripts/getMerkleProof';

describe('Greeter', function () {
  it("Should return the new greeting once it's changed", async function () {
    const Airdrop = await ethers.getContractFactory('Airdrop');
    const airdrop = await Airdrop.deploy('Airdrop contract deployed');
    await airdrop.deployed();
    const merkleTree = getMerkleTree();
    const proof = getProof();

    const merkleRoot = airdrop.getMerkleRoot();

    await merkleRoot.wait();

    const setMerkleRootTx = await airdrop.setMerkleRoot(
      getMerkleRoot(merkleTree)
    );

    // wait until the transaction is mined
    await setMerkleRootTx.wait();

    expect(await airdrop.verify(proof, ADDRESS)).to.equal(merkleRoot);
  });
});
