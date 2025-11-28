import axios from "axios";

// API REST de Yu-Gi-Oh! oficial: https://db.ygoprodeck.com/api/v7/cardinfo.php
export const axiosClient = axios.create({
  baseURL: "https://db.ygoprodeck.com/api/v7",
  timeout: 5000,
});
