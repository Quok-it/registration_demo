import React from "react";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <form className="flex flex-col gap-4 w-64">
        <label className="flex flex-col">
          Email
          <input
            type="email"
            className="border border-gray-300 rounded p-2 text-black"
            placeholder="Enter your email"
          />
        </label>
        <label className="flex flex-col">
          Password
          <input
            type="password"
            className="border border-gray-300 rounded p-2 text-black"
            placeholder="Enter your password"
          />
        </label>
        <label className="flex flex-col">
          GPU Model
          <select className="border border-gray-300 rounded p-2 text-black">
            <option value="h100">H100 with 80 GB of RAM</option>
            <option value="rtx4090">RTX 4090 with 24 GB</option>
            <option value="3070">3070 with 8 GB of RAM</option>
          </select>
        </label>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          Submit
        </button>
      </form>
    </main>
  );
}