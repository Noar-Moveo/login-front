import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Button, Box, Typography, TextField } from "@mui/material";
import axios from "axios";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError("סיסמאות לא תואמות");
      return;
    }

    if (password.length < 12) {
      setError("סיסמה צריכה להיות בת 12 תווים לפחות");
      return;
    }

    if (/\s/.test(password)) {
      setError("סיסמה לא יכולה לכלול רווחים");
      return;
    }

    setMessage(null);
    setError(null);

    try {
      const axiosInstance = axios.create({
        baseURL: "http://13.48.136.194/api",
        //baseURL: "http://localhost:3000/api",
      });
      const response = await axiosInstance.post("/users/reset-password", {
        token,
        newPassword: password,
      });

      console.log(response);
      setMessage(
        "Password reset successfully. Please login with your new password."
      );
      navigate("/password-reset-success");
    } catch (error: any) {
      setError("שגיאה");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography variant="h4" component="h1" sx={{ marginBottom: 2 }}>
          איתחול סיסמה
        </Typography>
        <TextField
          fullWidth
          label="סיסמה חדשה"
          name="password"
          type="password"
          margin="normal"
          onChange={handleChangePassword}
          autoComplete="off"
          value={password}
        />
        <TextField
          fullWidth
          label="אישור סיסמה"
          name="confirmPassword"
          type="password"
          margin="normal"
          onChange={handleChangeConfirmPassword}
          autoComplete="off"
          value={confirmPassword}
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
        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" onClick={handleResetPassword}>
            איתחול סיסמה
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ResetPassword;
