import React from "react";
import { Typography, Box } from "@mui/material";

const SuccessPage: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h2">Hello New User</Typography>
    </Box>
  );
};

export default SuccessPage;
