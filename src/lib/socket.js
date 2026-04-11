import { io } from "socket.io-client";

export const socket = io("https://chatnova-backend-og40.onrender.com", {
    withCredentials: true,
});

// export const socket = io("https://localhost:5000/", {
//     withCredentials: true,
// });