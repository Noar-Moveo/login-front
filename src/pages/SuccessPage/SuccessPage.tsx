import React from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Box position="relative" height="100vh" width="100%">
      <img
        src="../../../public/WhatsApp Image 2024-05-21 at 13.59.59.jpeg"
        alt="Success"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          objectFit: "cover",
        }}
      />
      <Button
        variant="contained"
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
        }}
      >
        התנתק
      </Button>
    </Box>
  );
};

export default SuccessPage;
