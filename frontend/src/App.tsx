import { useCallback, useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import axios from "axios";

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  const [mint, setMint] = useState("");
  const [tokenAccount, setTokenAccount] = useState("");
  const [vault, setVault] = useState("");
  const [amount, setAmount] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const createToken = useCallback(async () => {
    try {
      setStatusMessage("Creating token...");
      const res = await axios.post("http://localhost:3000/api/create-token", {
        name: "MyToken",
        symbol: "MTK",
        decimals: 6,
      });
      setMint(res.data.mint);
      setTokenAccount(res.data.tokenAccount);
      setVault(res.data.vault);
      setStatusMessage("Token created successfully!");
    } catch (err: any) {
      setStatusMessage("Token creation failed: " + err.message);
    }
  }, []);

  const buyToken = useCallback(async () => {
    try {
      setStatusMessage("Buying token...");
      await axios.post("http://localhost:3000/api/buy", {
        mintAddress: mint,
        tokenAccountAddress: tokenAccount,
        amount: parseInt(amount),
      });
      setStatusMessage("Token bought successfully!");
    } catch (err: any) {
      setStatusMessage("Token buying failed: " + err.message);
    }
  }, [mint, tokenAccount, amount]);

  const sellToken = useCallback(async () => {
    try {
      setStatusMessage("Selling token...");  
      await axios.post("http://localhost:3000/api/sell", {
        mintAddress: mint,
        tokenAccountAddress: tokenAccount,
        amount: parseInt(amount),
      });
      setStatusMessage("Token sold!");
    } catch (err: any) {
      setStatusMessage("Token selling failed: " + err.message);
    }
  }, [mint, tokenAccount, amount]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8 space-y-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Persist Ventures Assignment</h1>
            <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 text-white px-4 py-2 rounded" style={{ marginBottom: '2em' }} />
            <div className="bg-white shadow-md rounded-lg p-10 w-full max-w-md space-y-4">
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" style={{ marginBottom: '1em' }}
              />{statusMessage && (
                  <div className="mt-4 text-center px-4 py-3 rounded bg-gray-200 text-gray-800 border border-gray-300 text-sm" style={{ marginLeft: '2em', display: 'inline' }}>
                    {statusMessage}
                  </div>
                )}
              <div className="flex gap-4">
                <button
                  onClick={createToken}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-4 rounded" style={{ marginRight: '1em' }}
                >
                  Create Token
                </button>
                <button
                  onClick={buyToken}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded" style={{ marginRight: '1em' }}
                >
                  Buy
                </button>
                <button
                  onClick={sellToken}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                >
                  Sell
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-1" style={{ marginTop: '2em' }}> 
                <p><strong>Mint:</strong> {mint}</p>
                <p><strong>Token Account:</strong> {tokenAccount}</p>
                <p><strong>Vault:</strong> {vault}</p>
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;