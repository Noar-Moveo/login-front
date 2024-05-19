import React from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { ISignUpFormData } from "../../../data/types";
import resources from "../../../resources/resources.json";
import {
  formContainer,
  buttonBox,
  button,
  title,
  subtitle,
} from "../SignUp.style";

interface Step1Props {
  formData: ISignUpFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => void;
  errors: Partial<Record<keyof ISignUpFormData, string>>;
  areaCode: string;
  navigate: (path: string) => void;
}

const Step1: React.FC<Step1Props> = ({
  formData,
  handleChange,
  handleAreaCodeChange,
  handleNext,
  errors,
  areaCode,
  navigate,
}) => {
  return (
    <Box sx={formContainer}>
      <Typography variant="h4" component="h1" sx={title}>
        {resources.AddingYourPhoneNumberTitle}
      </Typography>
      <Typography variant="subtitle1" sx={subtitle}>
        {resources.AddingYourPhoneNumberSubtitle}
      </Typography>
      <form autoComplete="off">
        <TextField
          fullWidth
          id="areaCode"
          label="Area Code"
          name="areaCode"
          margin="normal"
          select
          SelectProps={{ native: true }}
          value={areaCode}
          onChange={handleAreaCodeChange}
        >
          <option value="+972">+972</option>
          <option value="+1">+1</option>
          <option value="+44">+44</option>
          <option value="+91">+91</option>
        </TextField>
        <TextField
          fullWidth
          id="phoneNumber"
          label={resources.phoneNumber}
          name="phoneNumber"
          margin="normal"
          autoComplete="off"
          onChange={handleChange}
          value={formData.phoneNumber}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
          InputLabelProps={{
            shrink: Boolean(formData.phoneNumber),
          }}
        />
        <Box sx={buttonBox}>
          <Button variant="outlined" onClick={() => navigate("/")} sx={button}>
            {resources.Back}
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={button}
            onClick={handleNext}
          >
            {resources.Next}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Step1;
