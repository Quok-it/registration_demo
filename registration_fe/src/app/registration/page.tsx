'use client'
import React, { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    gpuModel: "h100",
    staticIp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const result = await response.json();
    console.log(result);
  };


  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <form className="flex flex-col gap-4 w-64" onSubmit={handleSubmit}>
        <label className="flex flex-col">
          Email
          <input
            type="email"
            name="email"
            className="border border-gray-300 rounded p-2 text-black"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-col">
          Password
          <input
            type="password"
            name="password"
            className="border border-gray-300 rounded p-2 text-black"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-col">
          GPU Model
          <select
            name="gpuModel"
            className="border border-gray-300 rounded p-2 text-black"
            value={formData.gpuModel}
            onChange={handleChange}
          >
            <option value="h100">H100 with 80 GB of RAM</option>
            <option value="rtx4090">RTX 4090 with 24 GB of RAM</option>
            <option value="rtx3070">RTX 3070 with 8 GB of RAM</option>
          </select>
        </label>
        <label className="flex flex-col">
          Static IP
          <input
            type="text"
            name="staticIp"
            className="border border-gray-300 rounded p-2 text-black"
            placeholder="Enter your static IP"
            value={formData.staticIp}
            onChange={handleChange}
          />
        </label>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          Submit
        </button>
      </form>
    </main>
  );
}