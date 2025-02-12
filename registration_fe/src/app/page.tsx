import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
      <h1 className="text-3xl font-bold">Spheron Fizz Node</h1>
      <div className="flex gap-4">
        <Link href="/registration" className="bg-blue-500 text-white px-4 py-2 rounded">
          Register
        </Link>
        <Link href= "/login" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
          </Link>
      </div>
    </main>
  );
}