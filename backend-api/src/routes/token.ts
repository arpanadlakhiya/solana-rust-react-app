import express from "express";
import { program, provider, wallet } from "../utils/solana";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { getAccount, getMint } from "@solana/spl-token";

const router = express.Router();

const [vaultPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault")],
  program.programId
);

router.post("/create-token", async (req, res) => {
  try {
    const { name = "MyToken", symbol = "MTK", decimals = 6 } = req.body;

    const mint = anchor.web3.Keypair.generate();

    const tokenAccount = await anchor.utils.token.associatedAddress({
      mint: mint.publicKey,
      owner: wallet.publicKey,
    });

    await program.methods
      .createToken(name, symbol, decimals)
      .accounts({
        mint: mint.publicKey,
        tokenAccount,
        payer: wallet.publicKey,
        vault: vaultPda,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
      })
      .signers([mint])
      .rpc();

    res.json({
      mint: mint.publicKey.toBase58(),
      tokenAccount: tokenAccount.toBase58(),
      vault: vaultPda.toBase58(),
    });
  } catch (err: any) {
    console.error("create-token error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/buy", async (req, res) => {
  try {
    const { mintAddress, tokenAccountAddress, amount } = req.body;

    await program.methods
      .buy(new anchor.BN(amount))
      .accounts({
        payer: wallet.publicKey,
        mint: new PublicKey(mintAddress),
        tokenAccount: new PublicKey(tokenAccountAddress),
        vault: vaultPda,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .rpc();

    res.json({ status: "bought", amount });
  } catch (err: any) {
    console.error("buy error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/sell", async (req, res) => {
  try {
    const { mintAddress, tokenAccountAddress, amount } = req.body;

    await program.methods
      .sell(new anchor.BN(amount))
      .accounts({
        owner: wallet.publicKey,
        mint: new PublicKey(mintAddress),
        tokenAccount: new PublicKey(tokenAccountAddress),
        vault: vaultPda,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .rpc();

    res.json({ status: "sold", amount });
  } catch (err: any) {
    console.error("sell error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/wallet-balance", async (req, res) => {
  try {
    const { publicKey } = req.body;
    if (!publicKey) {
      res.status(400).json({ error: "Missing publicKey in request body" });
    } else {
      const pubkey = new PublicKey(publicKey);
      const balance = await provider.connection.getBalance(pubkey);
      const solBalance = balance / anchor.web3.LAMPORTS_PER_SOL;
  
      res.json({ balance: solBalance });
    }
  } catch (err: any) {
    console.error("wallet-balance error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/token-info", async (req, res) => {
  try {
    const { mintAddress, tokenAccountAddress } = req.body;

    const mint = new PublicKey(mintAddress);
    const tokenAccount = new PublicKey(tokenAccountAddress);

    const mintInfo = await getMint(provider.connection, mint);
    const accountInfo = await getAccount(provider.connection, tokenAccount);

    const totalSupply = Number(mintInfo.supply) / 1_000_000;
    const userBalance = Number(accountInfo.amount) / 1_000_000;

    res.json({
      totalSupply,
      userBalance,
    });
  } catch (err: any) {
    console.error("token-info error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
