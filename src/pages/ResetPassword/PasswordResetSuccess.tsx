import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Box, Typography } from "@mui/material";

const PasswordResetSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <Box sx={{ textAlign: "center", marginTop: 4 }}>
      <Container maxWidth="sm">
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
