import React from "react";
import { Box, TextField } from "@mui/material";
import { OtpInputProps } from "./OtpInput.type";

const OtpInput: React.FC<OtpInputProps> = ({ otp, handleChange }) => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}
    >
      {otp.map((digit, index) => (
        <TextField
          key={index}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          inputProps={{
            maxLength: 1,
            style: { textAlign: "center" },
          }}
          sx={{ width: "2.5rem", marginRight: 1 }}
        />
      ))}
    </Box>
  );
};

export default OtpInput;
