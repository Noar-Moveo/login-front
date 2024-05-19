import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { ISignUpFormData } from "../../../data/types";
import resources from "../../../resources/resources.json";
import {
  formContainer,
  buttonBox,
  button,
  title,
  subtitle,
} from "../SignUp.style";
import OtpInput from "../../../components/OtpInput/OtpInput";

interface Step2Props {
  formData: ISignUpFormData;
  handleOtpChange: (index: number, value: string) => void;
  handleNext: () => void;
  handleBack: () => void;
  errors: Partial<Record<keyof ISignUpFormData, string>>;
}

const Step2: React.FC<Step2Props> = ({
  formData,
  handleOtpChange,
  handleNext,
  handleBack,
}) => {
  return (
    <Box sx={formContainer}>
      <Typography variant="h4" component="h1" sx={title}>
        {resources.VerifyYourPhoneNumberTitle}
      </Typography>
      <Typography variant="subtitle1" sx={subtitle}>
        {resources.VerifyYourPhoneNumberSubtitle}
      </Typography>
      <form autoComplete="off">
        <OtpInput otp={formData.otp} handleChange={handleOtpChange} />
        <Button variant="text" onClick={() => {}}>
          {resources.ResendCode}
        </Button>
        <Box sx={buttonBox}>
          <Button variant="outlined" sx={button} onClick={handleBack}>
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

export default Step2;
