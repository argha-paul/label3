"use client";
import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/utils';

export const Appbar = () => {
  const { publicKey, signMessage } = useWallet();

  async function signAndSend() {
    if (!publicKey) {
      return;
    }
    const message = new TextEncoder().encode("Sign into mechanical turks");
    const signature = await signMessage?.(message);
    console.log("signature:  ", signature);
    console.log("publicKey:  ", publicKey);
    const response = await axios.post(`${BACKEND_URL}/v1/user/signin`, {
      signature,
      publicKey: publicKey?.toString()
    });

    localStorage.setItem("token", response.data.token);
  }

  useEffect(() => {
    signAndSend();
  }, [publicKey]);

  return (
    <div className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-indigo-600 tracking-tight">
            Label3
          </div>
        </div>
        <div className="flex items-center space-x-4">
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