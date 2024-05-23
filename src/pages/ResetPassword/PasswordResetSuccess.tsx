import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Box, Typography } from "@mui/material";

const PasswordResetSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
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
          הסיסמה שונתה בהצלחה!
        </Typography>
        <Button variant="contained" onClick={handleLogin}>
          להתחברות
        </Button>
      </Container>
    </Box>
  );
};

export default PasswordResetSuccess;
