import axios from "axios";

const getBaseUrl = () => {
  if (window.location.hostname === "localhost") {
    // return "http://localhost/api";
  }
  return "https://a2insights.com.br/api";
};

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("picnode_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = async (userData: any) => {
  try {
    const response = await axiosInstance.post("picnode/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

export const login = async (credentials: any) => {
  try {
    const response = await axiosInstance.post("picnode/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.delete("picnode/logout");
    return response.data;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};

export const updateProfile = async (userData: any) => {
  try {
    const response = await axiosInstance.put(
      "picnode/user/profile-information",
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const sendConfirmationEmail = async () => {
  try {
    const response = await axiosInstance.post("picnode/user/email-verification");
    return response.data;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await axiosInstance.get("picnode/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const createToken = async (tokenData: {
  name: string;
  expires_in_days?: number;
  allowed_apis: string[];
  limit_type: "total" | "rate_limit";
  limit_value: number;
}) => {
  try {
    const response = await axiosInstance.post("picnode/tokens", tokenData);
    return response.data;
  } catch (error) {
    console.error("Error creating token:", error);
    throw error;
  }
};

export const getTokens = async (page: number = 1) => {
  try {
    const response = await axiosInstance.get(`picnode/tokens?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tokens:", error);
    throw error;
  }
};

export const createCheckoutSession = async (checkoutData: {
  name: string;
  allowed_apis: string[];
  limit_type: "total" | "rate_limit";
  limit_value: string;
  currency: "brl" | "usd";
  expires_in_days?: number;
  success_url: string;
  cancel_url: string;
}) => {
  try {
    const response = await axiosInstance.post("picnode/checkout", checkoutData);
    return response.data;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};

export const getOrder = async (orderId: string) => {
  try {
    const response = await axiosInstance.get(`picnode/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const getOrders = async (page: number = 1) => {
  try {
    const response = await axiosInstance.get(`picnode/orders?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const calculateTotal = async (data: {
  allowed_apis: string[];
  limit_type: "total" | "rate_limit";
  limit_value: number;
  expires_in_days?: number;
  currency: "usd" | "eur" | "gbp" | "brl";
}) => {
  try {
    const response = await axiosInstance.post("picnode/orders/calculate-total", data);
    return response.data;
  } catch (error) {
    console.error("Error calculating total:", error);
    throw error;
  }
};

export const getDashboardData = async () => {
  try {
    const response = await axiosInstance.get("picnode/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export const apiService = {
  register,
  login,
  logout,
  updateProfile,
  sendConfirmationEmail,
  getMe,
  createToken,
  getTokens,
  createCheckoutSession,
  getOrder,
  getOrders,
  calculateTotal,
  getDashboardData,
  getBaseUrl,
  axiosInstance,
  get: axiosInstance.get, // Add generic GET method
};

export default apiService;
