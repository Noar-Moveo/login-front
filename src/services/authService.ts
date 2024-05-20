import axios from "axios";
import { ISignUpFormData } from "../data/types";

//const OTP_API_URL = `${BASE_URL}/otp`;

export const signup = async (formData: ISignUpFormData) => {
  try {
    const response = await axios.post(`${USER_API_URL}/signup`, formData);
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const sendOtp = async (phoneNumber: string) => {
  try {
    const axiosInstance = axios.create({
      baseURL: "https://localhost:3000/api",
    });
    const response = await axiosInstance.post(`/send-otp`, {
      phoneNumber,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOtp = async (phoneNumber: string, receivedOtp: string) => {
  try {
    const response = await axios.post(`${OTP_API_URL}/verify-otp`, {
      phoneNumber,
      receivedOtp,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};
