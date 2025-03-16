"use client";
import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../utils";

export const Appbar = () => {
  const { publicKey, signMessage } = useWallet();
  const [balance, setBalance] = useState(0);

  async function signAndSend() {
    if (!publicKey) {
      return;
    }
    const message = new TextEncoder().encode("Sign into mechanical turks as a worker");
    const signature = await signMessage?.(message);
    console.log("signature:  ", signature);
    console.log("publicKey:  ", publicKey);
    const response = await axios.post(`${BACKEND_URL}/v1/worker/signin`, {
      signature,
      publicKey: publicKey?.toString()
    });

    setBalance(response.data.amount);
    localStorage.setItem("token", response.data.token);
  }

  useEffect(() => {
    signAndSend();
  }, [publicKey]);

  const handlePayout = async () => {
    await axios.post(`${BACKEND_URL}/v1/worker/payout`, {}, {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    });
  };

  return (
    <div className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-indigo-600 tracking-tight">
            Label3
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handlePayout} 
            className="text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Pay me out ({balance}) SOL
          </button>
          {publicKey ? (
            <div className="flex items-center">
              <span className="text-sm text-slate-500 mr-2">Connected</span>
              <WalletDisconnectButton />
            </div>
          ) : (
            <WalletMultiButton />
          )}
        </div>
      </div>
    </div>
  );
};