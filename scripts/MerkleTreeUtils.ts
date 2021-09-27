import { MerkleTree } from 'merkletreejs';
import ethUtil from 'ethereumjs-util';

import keccak256 from 'keccak256';

export const buildMerkleTree = (leaves: any) => {
  const hasedhLeaves = leaves.map((leaf: any) => keccak256(leaf));

  return new MerkleTree(hasedhLeaves, keccak256, { sortPairs: true });
};

export const getMerkleRoot = (tree: any) => {
  return tree.getHexRoot();
};

export const getProofForLeaf = (tree: any, leaf: any) => {
  return tree.getHexProof(keccak256(leaf));
};
