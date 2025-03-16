"use client";
import { Appbar } from "@/components/Appbar";
import { Hero } from "@/components/Hero";
import { Upload } from "@/components/Upload";
import { useState } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Appbar />
      <div className="container mx-auto px-4 py-8">
        <Hero />
        <Upload />
      </div>
      <footer className="mt-16 py-6 bg-slate-800 text-slate-200 text-center text-sm">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Label3 - All rights reserved</p>
        </div>
      </footer>
    </main>
  );
}