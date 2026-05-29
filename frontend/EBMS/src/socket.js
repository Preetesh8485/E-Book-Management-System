import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL || "https://e-book-management-system-rprf.onrender.com";

export const socket = io(BASE_URL, {
  withCredentials: true,
  autoConnect: false, 
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ["websocket", "polling"]
});