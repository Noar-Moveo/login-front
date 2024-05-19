import axios from "axios";
import { BASE_URL } from "../constants/constants";
import { ISignUpFormData } from "../data/types";

const API_URL = `${BASE_URL}/users`;

export const signup = async (formData: ISignUpFormData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, formData);
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const sendOtp = async (
  to: string,
  channel: string = "sms",
  locale: string = "en"
) => {
  try {
    const response = await axios.post(`${API_URL}/send-otp`, {
      to,
      channel,
      locale,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOtp = async (to: string, code: string) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, {
      to,
      code,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};
