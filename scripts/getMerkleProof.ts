import { MerkleTree } from 'merkletreejs';
import SHA256 from 'crypto-js/sha256';

import * as accounts from '../utils/accounts.json';

const leaves = accounts.map((account) => SHA256(account));
const tree = new MerkleTree(leaves, SHA256);
const root = tree.getRoot().toString('hex');
const leaf: any = SHA256('LEAF');
const proof = tree.getProof(leaf);
console.log(tree.verify(proof, leaf, root)); // true

const badLeaves = accounts.map((account) => SHA256(account));
const badTree = new MerkleTree(badLeaves, SHA256);
const badLeaf: any = SHA256('x');
const badProof = tree.getProof(badLeaf);
