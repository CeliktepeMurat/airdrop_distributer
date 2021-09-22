import { MerkleTree } from 'merkletreejs';
import SHA256 from 'crypto-js/sha256';
import accounts from '../utils/accounts.json';

const ADDRESS: string = process.argv.slice(2)[0]; // get address from command line

// build merkle tree
// export tree and merkle root
export const getMerkleTree = () => {
  const leaves = accounts.map((account) => SHA256(account));

  const tree = new MerkleTree(leaves, SHA256);
  return tree;
};

// returns merkle root for a tree
export const getMerkleRoot = (tree: any) => {
  const root = tree.getRoot().toString('hex');
  return root;
};

// return merkle proof and ROOT
const getMerkleProofandRoot = () => {
  const tree = getMerkleTree();
  const root = getMerkleRoot(tree);

  const leaf: any = SHA256(ADDRESS);
  const proof = tree.getHexProof(leaf);

  console.log(`Merkle Root ->`, root);
  console.log(`Proof ->`, proof);
};

getMerkleProofandRoot();
