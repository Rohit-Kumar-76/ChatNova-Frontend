import { io } from "socket.io-client";

export const socket = io("https://chatnova-backend-og40.onrender.com", {
    withCredentials: true,
});
