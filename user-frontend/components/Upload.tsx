"use client";
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { UploadImage } from "@/components/UploadImage";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

export const Upload = () => {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("Select the most clickable thumbnail");
  const [txSignature, setTxSignature] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();

  async function onSubmit() {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/v1/user/task`, {
        options: images.map(image => ({
          imageUrl: image,
        })),
        title,
        signature: txSignature
      }, {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      });

      router.push(`/task/${response.data.id}`);
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function makePayment() {
    setIsLoading(true);
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey!,
          toPubkey: new PublicKey("dvHhZyzmZcnnZpgaosVkdxRZ7s3yvLrYcZJvMHFaMEz"),
          lamports: 100000000,
        })
      );

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight }
      } = await connection.getLatestBlockhashAndContext();

      const signature = await sendTransaction(transaction, connection, { minContextSlot });
      console.log("Signature:  ", signature);
      setTxSignature(signature);
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div id="upload-section" className="mt-8 max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Create a Task</h2>
        <p className="text-slate-500 mt-1">Upload images and set your task details</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
            Task Title
          </label>
          <input 
            id="title"
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
            placeholder="What would you like users to do?" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Task Images
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <UploadImage 
                  key={`${image}-${index}`} 
                  image={image} 
                  onImageAdded={(imageUrl) => setImages(i => [...i, imageUrl])} 
                />
                <button 
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
            
            {images.length < 6 && (
              <UploadImage 
                onImageAdded={(imageUrl) => setImages(i => [...i, imageUrl])} 
              />
            )}
          </div>
          
          <p className="text-sm text-slate-500 mt-2">
            {images.length === 0 
              ? "Add at least one image to create a task" 
              : `${images.length} ${images.length === 1 ? "image" : "images"} added. You can add up to 6 images.`}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-500">
              {txSignature ? "Ready to submit your task" : "Payment required to create task"}
            </div>
            
            <button 
              onClick={txSignature ? onSubmit : makePayment} 
              disabled={isLoading || (!txSignature && !publicKey) || (images.length === 0)}
              className={`
                px-6 py-3 rounded-lg font-medium flex items-center 
                ${(!publicKey || images.length === 0) ? 
                  'bg-slate-300 text-slate-500 cursor-not-allowed' : 
                  'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'}
                transition-colors duration-200
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : txSignature ? (
                "Submit Task"
              ) : (
                "Pay 0.1 SOL"
              )}
            </button>
          </div>
          
          {!publicKey && (
            <p className="text-sm text-red-500 mt-2">
              Please connect your wallet to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};