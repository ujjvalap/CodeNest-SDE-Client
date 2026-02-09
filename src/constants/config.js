// src/config/apiConfig.js

export const server = import.meta.env.VITE_HOST || "http://localhost:5000";

export const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};



