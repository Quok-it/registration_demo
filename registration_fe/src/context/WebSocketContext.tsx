"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
      console.log("Connecting WebSocket...");
      ws.current = new WebSocket("ws://localhost:3001");

      ws.current.onopen = () => {
        console.log("WebSocket Connected!");
        setIsConnected(true);
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      ws.current.onclose = (event) => {
        console.warn("WebSocket Disconnected:", event.reason);
        setIsConnected(false);
      };

      return () => {
        console.log("Closing WebSocket...");
        ws.current?.close();
      };
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ ws: ws.current, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
