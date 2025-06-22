import * as anchor from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();

const secret = JSON.parse(process.env.PRIVATE_KEY!);
const payer = Keypair.fromSecretKey(Uint8Array.from(secret));

const connection = new Connection(process.env.CLUSTER_URL!, "confirmed");

const wallet: anchor.Wallet = {
  publicKey: payer.publicKey,
  payer,

  signTransaction: async <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
    if (tx instanceof Transaction) {
      tx.partialSign(payer);
    } else if (tx instanceof VersionedTransaction) {
      tx.sign([payer]);
    }
    return tx;
  },

  signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => {
    return Promise.all(
      txs.map(async (tx) => {
        if (tx instanceof Transaction) {
          tx.partialSign(payer);
        } else if (tx instanceof VersionedTransaction) {
          tx.sign([payer]);
        }
        return tx;
      })
    );
  },
};

const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});

import idl from "../../../solana-program/target/idl/solana_program.json";

const program = new anchor.Program(idl as anchor.Idl, provider);

export { provider, program, payer, wallet };

