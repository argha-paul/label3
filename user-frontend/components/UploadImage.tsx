"use client";
import { BACKEND_URL, CLOUDFRONT_URL } from "@/utils";
import axios from "axios";
import { useState } from "react";

export function UploadImage({ onImageAdded, image }: {
  onImageAdded: (image: string) => void;
  image?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function onFileSelect(e: any) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type and size
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5MB");
      return;
    }
    
    setUploading(true);
    setUploadError("");
    
    try {
      const response = await axios.get(`${BACKEND_URL}/v1/user/presignedUrl`, {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      });
      
      const presignedUrl = response.data.preSignedUrl;
      const formData = new FormData();
      formData.set("bucket", response.data.fields["bucket"]);
      formData.set("X-Amz-Algorithm", response.data.fields["X-Amz-Algorithm"]);
      formData.set("X-Amz-Credential", response.data.fields["X-Amz-Credential"]);
      formData.set("X-Amz-Date", response.data.fields["X-Amz-Date"]);
      formData.set("key", response.data.fields["key"]);
      formData.set("Policy", response.data.fields["Policy"]);
      formData.set("X-Amz-Signature", response.data.fields["X-Amz-Signature"]);
      formData.append("file", file);
      
      await axios.post(presignedUrl, formData);
      onImageAdded(`${CLOUDFRONT_URL}/${response.data.fields["key"]}`);
    } catch (e) {
      console.error("Upload error:", e);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  if (image) {
    return (
      <div className="rounded-lg overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
        <img 
          className="w-full h-48 object-cover" 
          src={image} 
          alt="Uploaded" 
        />
      </div>
    );
  }

  return (
    <div className="w-full h-48">
      <label className="flex flex-col items-center justify-center w-full h-full rounded-lg border-2 border-dashed border-slate-300 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {uploading ? (
            <div className="text-center">
              <svg className="animate-spin h-10 w-10 text-indigo-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm text-slate-500">Uploading...</p>
            </div>
          ) : (
            <>
              <svg className="w-8 h-8 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="mb-1 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
              {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
            </>
          )}
        </div>
        <input 
          id="dropzone-file" 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={onFileSelect}
          disabled={uploading}
        />
      </label>
    </div>
  );
}