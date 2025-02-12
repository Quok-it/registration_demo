'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Gauge } from '@/components/ui/gauge';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const Dashboard = ({ nodeId = 'Node123', networkHealth = 75, gpus = [] }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold mb-6 text-white">Welcome {nodeId}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Network Health Meter */}
        <Card>
          <CardContent className="bg-gray-800 shadow-lg rounded-lg flex flex-col items-center p-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-300">Network Health</h2>
            <Gauge value={networkHealth} min={0} max={100} className="w-40 h-40" />
            <p className={`mt-2 text-lg font-bold ${networkHealth >= 80 ? 'text-green-400' : 'text-red-400'}`}>
              {networkHealth}%
            </p>
          </CardContent>
        </Card>

        {/* Actions Panel */}
        <Card>
          <CardContent className="bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-300">Actions</h2>
            {networkHealth >= 80 ? (
              <p className="text-green-500 font-medium">✅ Everything looks good!</p>
            ) : (
              <Button variant="destructive" className="w-full mt-3">
                ⚠️ Check Warnings
              </Button>
            )}
          </CardContent>
        </Card>

        {/* GPU Lookup Table */}
        <Card>
          <CardContent className="bg-gray-800 shadow-lg rounded-lg col-span-1 md:col-span-2 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-300">GPU Lookup</h2>
            <input
              type="text"
              placeholder="🔍 Search GPUs..."
              className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-md mb-4 focus:ring focus:ring-blue-500"
            />
            <Table className="w-full bg-gray-900 rounded-lg">
              <TableHead className="bg-gray-700 text-white">
                <TableRow>
                  <TableCell className="p-3 font-semibold">ID</TableCell>
                  <TableCell className="p-3 font-semibold">Model</TableCell>
                  <TableCell className="p-3 font-semibold">Status</TableCell>
                  <TableCell className="p-3 font-semibold">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gpus.length > 0 ? (
                  gpus.map((gpu) => (
                    <TableRow key={gpu.id} className="hover:bg-gray-700 transition">
                      <TableCell className="p-3">{gpu.id}</TableCell>
                      <TableCell className="p-3">{gpu.model}</TableCell>
                      <TableCell className="p-3">
                        <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          gpu.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {gpu.status}
                        </span>
                      </TableCell>
                      <TableCell className="p-3">
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md" 
                          onClick={() => router.push(`/gpu/${gpu.id}`)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="4" className="text-center p-4 text-gray-500">
                      🚫 No GPUs available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
