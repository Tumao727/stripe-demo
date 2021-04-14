import axios from "axios";

const BASE_URL = "http://172.16.20.151";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 300000,
});

export const getSecret = async (param: {
  amount: number;
  currency: string;
  email: string;
}) => {
  const { amount, currency, email } = param;

  const res = await axiosInstance.get("/secret", {
    params: { amount, currency, email },
  });
  return res.data;
};

export const createCheckoutSession = async () => {
  const res = await axiosInstance.post("/create-checkout-session");

  return res.data;
};
