import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaProgram } from "../target/types/solana_program";

describe("solana-program", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.solanaProgram as Program<SolanaProgram>;

  it("Is initialized!", async () => {
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
