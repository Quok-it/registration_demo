'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    networkId: "",
    providerId: "",
    location: "",
    gpu: {
      name: "H100",
      ram: 80,
      gpu_uuid: ""
    }
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "gpuModel") {
      const [gpuName, gpuRam] = value.split("|");
      setFormData(prevData => ({
        ...prevData,
        gpu: {
          ...prevData.gpu,
          name: gpuName,
          ram: parseInt(gpuRam)
        }
      }));
    } else if (name.startsWith("gpu.")) {
      const gpuField = name.split(".")[1];
      setFormData(prevData => ({
        ...prevData,
        gpu: {
          ...prevData.gpu,
          [gpuField]: value
        }
      }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        networkId: parseInt(formData.networkId),
        providerId: parseInt(formData.providerId),
        location: parseInt(formData.location),
        gpus: [formData.gpu]
      }),
    });
    const result = await response.json();
    console.log(result);

    if (result.success && result.data.status === 0) {
      router.push(`/gpu-info?data=${encodeURIComponent(JSON.stringify(result.data))}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Register GPU Node</h1>
      <form className="flex flex-col gap-4 w-64" onSubmit={handleSubmit}>
        <label className="flex flex-col">
          Network ID
          <input
            type="number"
            name="networkId"
            className="border border-gray-300 rounded p-2 text-black"
            placeholder="Enter network ID"
            value={formData.networkId}
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-col">
          Provider ID
          <input
            type="number"
            name="providerId"
            className="border border-gray-300 rounded p-2 text-black"
            placeholder="Enter provider ID"
            value={formData.providerId}
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-col">
          Location
          <input
            type="number"
            name="location"
            className="border border-gray-300 rounded p-2 text-black"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-col">
          GPU Model
          <select
            name="gpuModel"
            className="border border-gray-300 rounded p-2 text-black"
            value={`${formData.gpu.name}|${formData.gpu.ram}`}
            onChange={handleChange}
          >
            <option value="H100|80">H100 with 80 GB of RAM</option>
            <option value="RTX4090|24">RTX 4090 with 24 GB of RAM</option>
            <option value="RTX3070|8">RTX 3070 with 8 GB of RAM</option>
          </select>
        </label>
        <label className="flex flex-col">
          GPU UUID
          <input
            type="text"
            name="gpu.gpu_uuid"
            className="border border-gray-300 rounded p-2 text-black"
            placeholder="Enter GPU UUID"
            value={formData.gpu.gpu_uuid}
            onChange={handleChange}
          />
        </label>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          Register GPU Node
        </button>
      </form>
    </main>
  );
}