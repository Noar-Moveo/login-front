import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Box, Typography, TextField } from "@mui/material";
import axios from "axios";
import resources from "../../resources/resources.json";
import * as styles from "./ForgotPassword.style";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    console.log(navigate);
  };

  const handleSendClick = async () => {
    setMessage(null);
    setError(null);
    try {
      const axiosInstance = axios.create({
        baseURL: "http://13.48.136.194/api",

//        baseURL: "http://localhost:3000/api",
      });
      const response = await axiosInstance.post("/users/forgot-password", {
        email,
      });
      console.log(response);
      setMessage("Password reset link sent to your email.");
    } catch (error: any) {
      setError("Failed to send reset link. Please try again.");
    }
  };

  return (
    <Box sx={styles.outerContainer}>
      <Container maxWidth="sm" sx={styles.innerContainer}>
        <Typography variant="h4" component="h1" sx={styles.title}>
          {resources.ForgotPassword}
        </Typography>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          margin="normal"
          onChange={handleChange}
          autoComplete="off"
          value={email}
        />
        {message && (
          <Box sx={{ textAlign: "right", color: "green" }}>
            <Typography>{message}</Typography>
          </Box>
        )}
        {error && (
          <Box sx={{ textAlign: "right", color: "red" }}>
            <Typography>{error}</Typography>
          </Box>
        )}
        <Box sx={styles.buttonBox}>
          <Button
            variant="contained"
            onClick={handleSendClick}
            sx={styles.button}
          >
            {resources.SendResetLink}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
