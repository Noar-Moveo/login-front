import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button, Box, Typography, TextField } from "@mui/material";
import * as styles from "./Login.style";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/login", formData);
      // Handle successful login, e.g., store token, navigate to dashboard
      console.log("Login successful:", response.data);
      navigate("/dashboard"); // Redirect to a dashboard or home page
    } catch (error: any) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <Box sx={styles.outerContainer}>
      <Container maxWidth="sm" sx={styles.innerContainer}>
        <Typography variant="h3" component="h1" sx={styles.title}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            onChange={handleChange}
            autoComplete="off"
            value={formData.email}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            onChange={handleChange}
            autoComplete="off"
            value={formData.password}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Box sx={styles.buttonBox}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={styles.button}
            >
              Login
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default Login;
