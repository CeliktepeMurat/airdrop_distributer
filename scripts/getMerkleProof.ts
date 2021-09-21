import { MerkleTree } from "merkletreejs";
import SHA256 from "crypto-js/sha256";
import accounts from "../utils/accounts.json";

const leaves = accounts.map((account) => SHA256(account));

const tree = new MerkleTree(leaves, SHA256);
const root = tree.getRoot().toString("hex");
const leaf: any = SHA256(
  "0xca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb"
);

const proof = tree.getProof(leaf);
console.log(tree.verify(proof, leaf, root)); // true

// build merkle tree
// export tree and merkle root
export const getMerkleTree = () => {};

// return merkle proof for specific leaf
export const getMerkleProof = (leaf: any) => {};

// returns merkle root for a tree
export const getMerkleRoot = (tree: any) => {};
