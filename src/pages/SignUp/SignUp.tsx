import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Container,
  Modal,
  Link,
  TextFieldProps,
} from "@mui/material";
import { ISignUpFormData } from "../../data/types";
import resources from "../../resources/resources.json";
import {
  outerContainer,
  innerContainer,
  formContainer,
  buttonBox,
  button,
  title,
  subtitle,
} from "./SignUp.style";
import OtpInput from "../../components/OtpInput/OtpInput";
import { signup } from "../../services/authService";

type FormErrors = Partial<Record<keyof ISignUpFormData, string>>;

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState<ISignUpFormData>({
    phoneNumber: "",
    otp: ["", "", "", ""],
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    companyName: "",
    businessID: "",
    agreedToTerms: false,
    creditCardName: "",
    bank: "",
    branch: "",
    accountNumber: "",
    creditCardNumber: "",
    expirationDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [areaCode, setAreaCode] = useState("+972");
  const [isTermsOpen, setTermsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAreaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAreaCode(e.target.value);
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });
  };

  const validateFields = (
    fields: Partial<
      Record<
        keyof ISignUpFormData,
        {
          required: boolean;
          min?: number;
          max?: number;
          customValidation?: (value: string) => boolean;
        }
      >
    >
  ) => {
    const newErrors: FormErrors = {};
    Object.keys(fields).forEach((field) => {
      const key = field as keyof ISignUpFormData;
      const value = formData[key];
      if (!value && fields[key]?.required) {
        newErrors[key] = `${
          resources[key as keyof typeof resources]
        } is required`;
      } else if (
        value &&
        typeof value === "string" &&
        fields[key]?.min &&
        value.length < fields[key].min
      ) {
        newErrors[key] = `${
          resources[key as keyof typeof resources]
        } must be at least ${fields[key]?.min} characters`;
      } else if (
        value &&
        typeof value === "string" &&
        fields[key]?.max &&
        value.length > fields[key].max
      ) {
        newErrors[key] = `${
          resources[key as keyof typeof resources]
        } cannot exceed ${fields[key]?.max} characters`;
      } else if (
        value &&
        fields[key]?.customValidation &&
        !fields[key]!.customValidation!(value)
      ) {
        newErrors[key] = `${
          resources[key as keyof typeof resources]
        } is not valid`;
      }
    });
    return newErrors;
  };

  const handleNext = async () => {
    setErrors({});

    const newErrors = validateFields({
      phoneNumber: {
        required: page === 1,
        min: 9,
        max: 15,
        customValidation: (value) => /^\d{9}$/.test(value),
      },
      otp: { required: page === 2 },
      email: {
        required: page === 3,
        customValidation: (value) =>
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
      },
      password: { required: page === 3, min: 6 },
      firstName: { required: page === 4 },
      lastName: { required: page === 4 },
      dateOfBirth: {
        required: page === 4,
        customValidation: (value) => new Date(value) < new Date(),
      },
      companyName: { required: page === 4 },
      businessID: { required: page === 4 },
      agreedToTerms: { required: page === 4 },
      creditCardName: { required: page === 5 },
      bank: { required: page === 5 },
      branch: { required: page === 5 },
      accountNumber: { required: page === 5 },
      creditCardNumber: { required: page === 6 },
      expirationDate: {
        required: page === 6,
        customValidation: (value) => new Date(value) > new Date(),
      },
      cvv: {
        required: page === 6,
        customValidation: (value) => /^\d{3}$/.test(value),
      },
    });

    console.log("New Errors:", newErrors); // Log errors
    console.log("Form Data:", formData); // Log form data

    if (Object.keys(newErrors).length === 0) {
      if (page === 1) {
        try {
          // await sendOtp(formData.phoneNumber);
          setPage(2);
        } catch (error) {
          console.error("Error sending OTP:", error);
          setErrors({ phoneNumber: "Failed to send OTP. Please try again." });
        }
      } else if (page === 2) {
        try {
          // await verifyOtp(formData.phoneNumber, formData.otp.join(""));
          setPage(3);
        } catch (error) {
          console.error("Error verifying OTP:", error);
          setErrors({ otp: "Invalid OTP. Please try again." });
        }
      } else if (page === 6) {
        await handleSubmit();
      } else {
        setPage((prevPage) => prevPage + 1);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleBack = () => {
    setErrors({});
    setPage((prevPage) => prevPage - 1);
  };

  const handleSubmit = async () => {
    console.log("Submitting form with data:", formData);

    const { otp, ...dataWithoutOtp } = formData;

    try {
      const response = await signup(dataWithoutOtp);
      console.log("Sign up successful:", response);
      navigate("/success");
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const backendErrors: FormErrors = {};
        backendErrors[error.response.data.field] = error.response.data.message;
        setErrors(backendErrors);
      } else {
        console.error("Sign up failed:", error);
      }
    }
  };

  const renderField = (
    id: keyof ISignUpFormData,
    label: string,
    type: string = "text",
    otherProps: TextFieldProps = {}
  ) => (
    <TextField
      fullWidth
      id={id}
      label={label}
      name={id}
      type={type}
      margin="normal"
      autoComplete="off"
      onChange={handleChange}
      value={formData[id] || ""}
      error={!!errors[id]}
      helperText={errors[id]}
      InputLabelProps={{
        shrink: Boolean(formData[id]),
      }}
      {...otherProps}
    />
  );

  const handleOpenTerms = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    setTermsOpen(true);
  };

  const handleCloseTerms = () => setTermsOpen(false);

  return (
    <Box sx={outerContainer}>
      <Container sx={innerContainer}>
        {page === 1 && (
          <Box sx={formContainer}>
            <Typography variant="h4" component="h1" sx={title}>
              {resources.AddingYourPhoneNumberTitle}
            </Typography>
            <Typography variant="subtitle1" sx={subtitle}>
              {resources.AddingYourPhoneNumberSubtitle}
            </Typography>
            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
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
              {renderField("phoneNumber", resources.phoneNumber)}
              <Box sx={buttonBox}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/")}
                  sx={button}
                >
                  {resources.Back}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={button}
                  type="submit"
                >
                  {resources.Next}
                </Button>
              </Box>
            </form>
          </Box>
        )}
        {page === 2 && (
          <Box sx={formContainer}>
            <Typography variant="h4" component="h1" sx={title}>
              {resources.VerifyYourPhoneNumberTitle}
            </Typography>
            <Typography variant="subtitle1" sx={subtitle}>
              {resources.VerifyYourPhoneNumberSubtitle}
            </Typography>
            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
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
                  type="submit"
                >
                  {resources.Next}
                </Button>
              </Box>
            </form>
          </Box>
        )}
        {page === 3 && (
          <Box sx={formContainer}>
            <Typography variant="h4" component="h1" sx={title}>
              {resources.MailAndPassword}
            </Typography>
            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              {renderField("email", resources.email, "email")}
              {renderField("password", resources.password, "password")}
              <Box sx={buttonBox}>
                <Button variant="outlined" sx={button} onClick={handleBack}>
                  {resources.Back}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={button}
                  type="submit"
                >
                  {resources.Next}
                </Button>
              </Box>
            </form>
          </Box>
        )}
        {page === 4 && (
          <Box sx={formContainer}>
            <Typography variant="h4" component="h1" sx={title}>
              {resources.DefinitionOfProfileTitle}
            </Typography>
            <Typography variant="subtitle1" sx={subtitle}>
              {resources.DefinitionOfProfileSubtitle}
            </Typography>
            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              {renderField("firstName", resources.firstName)}
              {renderField("lastName", resources.lastName)}
              {renderField("dateOfBirth", resources.dateOfBirth, "date", {
                InputLabelProps: { shrink: true },
              })}
              {renderField("companyName", resources.companyName)}
              {renderField("businessID", resources.businessID)}
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreedToTerms"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreedToTerms: e.target.checked,
                      })
                    }
                    checked={formData.agreedToTerms}
                  />
                }
                label={resources.Agree}
              />
              <Link href="#" variant="body2" onClick={handleOpenTerms}>
                ראה תנאי שימוש{" "}
              </Link>
              <Modal
                open={isTermsOpen}
                onClose={handleCloseTerms}
                aria-labelledby="terms-modal-title"
                aria-describedby="terms-modal-description"
              >
                <Box
                  sx={{
                    position: "absolute" as const,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 300,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <Typography
                    id="terms-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    ראה תנאי שימוש{" "}
                  </Typography>
                  <Typography id="terms-modal-description" sx={{ mt: 2 }}>
                    {/* Add your terms and conditions content here */}
                    These are the terms and conditions...
                  </Typography>
                  <Button onClick={handleCloseTerms}>Close</Button>
                </Box>
              </Modal>
              <Box sx={buttonBox}>
                <Button variant="outlined" sx={button} onClick={handleBack}>
                  {resources.Back}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={button}
                  type="submit"
                  disabled={!formData.agreedToTerms}
                >
                  {resources.Next}
                </Button>
              </Box>
            </form>
          </Box>
        )}
        {page === 5 && (
          <Box sx={formContainer}>
            <Typography variant="h4" component="h1" sx={title}>
              {resources.BankAccountDetailsTitle}
            </Typography>
            <Typography variant="subtitle1" sx={subtitle}>
              {resources.DefinitionOfProfileSubtitle}
            </Typography>
            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              {renderField("creditCardName", resources.accountName)}
              {renderField("bank", resources.Bank)}
              {renderField("branch", resources.branchNumber)}
              {renderField("accountNumber", resources.accountNumber)}
              <Box sx={buttonBox}>
                <Button variant="outlined" sx={button} onClick={handleBack}>
                  {resources.Back}
                </Button>
                <Button variant="contained" sx={button} type="submit">
                  {resources.Next}
                </Button>
              </Box>
            </form>
          </Box>
        )}
        {page === 6 && (
          <Box sx={formContainer}>
            <Typography variant="h4" component="h1" sx={title}>
              {resources.CreditCardDetailsTitle}
            </Typography>
            <Typography variant="subtitle1" sx={subtitle}>
              {resources.DefinitionOfProfileSubtitle}
            </Typography>
            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {renderField("creditCardNumber", resources.creditCardNumber)}
              {renderField(
                "expirationDate",
                resources.expirationDate,
                "month",
                {
                  InputLabelProps: { shrink: true },
                }
              )}
              {renderField("cvv", resources.CVV)}
              <Box sx={buttonBox}>
                <Button variant="outlined" sx={button} onClick={handleBack}>
                  {resources.Back}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={button}
                >
                  {resources.FinishRegistration}
                </Button>
              </Box>
            </form>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SignUp;
