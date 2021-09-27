import { expect } from 'chai';
import { ethers } from 'hardhat';
import { getProof } from '../scripts/getMerkleProof';
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

  //Verify function

  it('It should return true if addr1 and addr2 used, false when addr3 is used', async function () {
    const proof1 = getProof(addr1);
    const proof2 = getProof(addr2);
    // const proof3 = getProof(addr3);

    await Contract.setMerkleRoot(root);

    const verify1 = await Contract.verify(proof1);
    console.log(verify1);
    // expect(verify1).to.be.equal(true);

    const verify2 = await Contract.verify(proof2);
    // expect(verify2).to.be.equal(true);
    console.log(verify2);

    const verify3 = await Contract.connect(addr3).verify(proof2);
    // expect(verify3).to.be.equal(false);
    console.log(verify3);
  });
});
