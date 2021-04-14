import axios from "axios";

const BASE_URL = "http://172.16.20.151";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 300000,
});

export const getSecret = async (param: {
  amount: number;
  currency: string;
}) => {
  const { amount, currency } = param;

  const res = await axiosInstance.get("/secret", {
    params: { amount, currency },
  });
  return res.data;
};
