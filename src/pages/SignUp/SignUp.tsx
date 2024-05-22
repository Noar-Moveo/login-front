import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  TextFieldProps,
  FormControlLabel,
  Checkbox,
  Link,
  Modal,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
import { TermAndConditions } from "./TermAndCondition";

type FormErrors = Partial<Record<keyof ISignUpFormData, string>>;

const bankOptions = [
  { value: "בנק לאומי (10)", label: "בנק לאומי (10)" },
  { value: "הבנק הבינלאומי הראשון (31)", label: "הבנק הבינלאומי הראשון (31)" },
  {
    value: "בנק של קופת העובד הלאומי (48)",
    label: "בנק של קופת העובד הלאומי (48)",
  },
  //{ value: "אחר", label: "אחר" },
];

const steps = [
  "Phone Number",
  "Verify OTP",
  "Email and Password",
  "Profile Details",
  "Bank Details",
  "Credit Card Details",
];

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
  const [sentOtp, setSentOtp] = useState("");
  const [isTermsOpen, setTermsOpen] = useState(false);
  const [isCustomBank, setIsCustomBank] = useState(false);

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === "אחר") {
      console.log(sentOtp);

      setIsCustomBank(true);
      setFormData({ ...formData, bank: "" });
    } else {
      setIsCustomBank(false);
      setFormData({ ...formData, bank: value });
    }

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors.bank;
      return newErrors;
    });
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear the error for the specific field
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name as keyof ISignUpFormData];
      return newErrors;
    });

    if (name === "email") {
      try {
        const axiosInstance = axios.create({
          //baseURL: "http://localhost:3000/api",
          baseURL: "http://13.48.136.194/api",
        });
        const response = await axiosInstance.post("users/check-email", {
          email: value,
        });
        if (response.data.exists) {
          setErrors({ email: "User already exists" });
        } else {
          setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.email;
            return newErrors;
          });
        }
      } catch (error) {
        console.error("Error checking email:", error);
        setErrors({ email: "Failed to check email. Please try again." });
      }
    }
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

      if (fields[key]?.required && !value) {
        newErrors[key] = `${
          resources[key as keyof typeof resources]
        } is required`;
      } else if (
        value &&
        typeof value === "string" &&
        fields[key]?.min !== undefined &&
        value.length < fields[key]!.min!
      ) {
        newErrors[key] = `${
          resources[key as keyof typeof resources]
        } must be at least ${fields[key]!.min!} characters`;
      } else if (
        value &&
        typeof value === "string" &&
        fields[key]?.max !== undefined &&
        value.length > fields[key]!.max!
      ) {
        newErrors[key] = `${
          resources[key as keyof typeof resources]
        } cannot exceed ${fields[key]!.max!} characters`;
      } else if (
        value &&
        typeof value === "string" &&
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

  // const handleNext = async () => {
  //   setErrors({});

  //   const newErrors = validateFields({
  //     phoneNumber: {
  //       required: page === 1,
  //       min: 9,
  //       max: 9,
  //       customValidation: (value) =>
  //         /^(50|52|53|54|55|57|58)\d{7}$/.test(value),
  //     },
  //     otp: { required: page === 2 },
  //     email: {
  //       required: page === 3,
  //       customValidation: (value) =>
  //         /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
  //     },
  //     password: { required: page === 3, min: 12 },
  //     firstName: {
  //       required: page === 4,
  //       customValidation: (value) => /^[a-zA-Z]{1,50}$/.test(value),
  //     },
  //     lastName: {
  //       required: page === 4,
  //       customValidation: (value) => /^[a-zA-Z]{1,50}$/.test(value),
  //     },
  //     dateOfBirth: {
  //       required: page === 4,
  //       customValidation: (value) => new Date(value) < new Date(),
  //     },
  //     companyName: {
  //       required: page === 4,
  //       customValidation: (value) => /^[a-zA-Z0-9]{1,50}$/.test(value),
  //     },
  //     businessID: {
  //       required: page === 4,
  //       customValidation: (value) => /^\d{8,9}$/.test(value),
  //     },
  //     agreedToTerms: { required: page === 4 },
  //     creditCardName: {
  //       required: page === 5,
  //       customValidation: (value) => /^[a-zA-Z]{1,50}$/.test(value),
  //     },
  //     bank: { required: page === 5 },
  //     branch: {
  //       required: page === 5,
  //       customValidation: (value) => /^\d{3}$/.test(value),
  //     },
  //     accountNumber: {
  //       required: page === 5,
  //       customValidation: (value) => /^\d{1,9}$/.test(value),
  //     },
  //     creditCardNumber: {
  //       required: page === 6,
  //       customValidation: (value) => /^\d{16}$/.test(value),
  //     },
  //     expirationDate: {
  //       required: page === 6,
  //       customValidation: (value) => new Date(value) > new Date(),
  //     },
  //     cvv: {
  //       required: page === 6,
  //       customValidation: (value) => /^\d{3}$/.test(value),
  //     },
  //   });

  //   if (Object.keys(newErrors).length === 0) {
  //     if (page === 1) {
  //       try {
  //         const axiosInstance = axios.create({
  //           //baseURL: "http://localhost:3000/api",
  //           baseURL: "http://13.48.136.194/api",

  //         });

  //         const response = await axiosInstance.post("/otp/send-otp", {
  //           phoneNumber: `${areaCode}${formData.phoneNumber}`,
  //         });
  //         setSentOtp(response.data.otp);
  //         setPage(2);
  //       } catch (error) {
  //         console.error("Error sending OTP:", error);
  //         setErrors({ phoneNumber: "Failed to send OTP. Please try again." });
  //       }
  //     } else if (page === 2) {
  //       const receivedOtp = formData.otp.join("");
  //       try {
  //         const axiosInstance = axios.create({
  //           //baseURL: "http://localhost:3000/api",
  //           baseURL: "http://13.48.136.194/api",

  //         });
  //         const response = await axiosInstance.post("/otp/verify-otp", {
  //           phoneNumber: `${areaCode}${formData.phoneNumber}`,
  //           receivedOtp,
  //         });
  //         if (response.data.message === "OTP verified successfully") {
  //           setPage(3);
  //         } else {
  //           setErrors({ otp: "שגוי OTP" });
  //         }
  //       } catch (error) {
  //         if (axios.isAxiosError(error)) {
  //           if (error.response && error.response.status === 400) {
  //             setErrors({ otp: "שגוי OTP" });
  //           } else {
  //             console.error("Error verifying OTP:", error);
  //             setErrors({ otp: "שגוי OTP" });
  //           }
  //         } else {
  //           console.error("Unknown error verifying OTP:", error);
  //           setErrors({ otp: "An unknown error occurred. Please try again." });
  //         }
  //       }
  //     } else if (page === 6) {
  //       await handleSubmit();
  //     } else {
  //       setPage((prevPage) => prevPage + 1);
  //     }
  //   } else {
  //     setErrors(newErrors);
  //   }
  // };
  const handleNext = async () => {
    setErrors({});

    const newErrors = validateFields({
      phoneNumber: {
        required: page === 1,
        min: 9,
        max: 9,
        customValidation: (value) =>
          /^(50|52|53|54|55|57|58)\d{7}$/.test(value),
      },
      otp: { required: page === 2 },
      email: {
        required: page === 3,
        customValidation: (value) =>
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
      },
      password: { required: page === 3, min: 12 },
      firstName: {
        required: page === 4,
        customValidation: (value) =>
          /^[\u0590-\u05FFa-zA-Z]{1,50}$/.test(value),
      },
      lastName: {
        required: page === 4,
        customValidation: (value) =>
          /^[\u0590-\u05FFa-zA-Z]{1,50}$/.test(value),
      },
      dateOfBirth: {
        required: page === 4,
        customValidation: (value) => new Date(value) < new Date(),
      },
      companyName: {
        required: page === 4,
        customValidation: (value) =>
          /^[\u0590-\u05FFa-zA-Z0-9]{1,50}$/.test(value),
      },
      businessID: {
        required: page === 4,
        customValidation: (value) => /^\d{8,9}$/.test(value),
      },
      agreedToTerms: { required: page === 4 },
      creditCardName: {
        required: page === 5,
        customValidation: (value) =>
          /^[\u0590-\u05FFa-zA-Z]{1,50}$/.test(value),
      },
      bank: { required: page === 5 },
      branch: {
        required: page === 5,
        customValidation: (value) => /^\d{3}$/.test(value),
      },
      accountNumber: {
        required: page === 5,
        customValidation: (value) => /^\d{1,9}$/.test(value),
      },
      creditCardNumber: {
        required: page === 6,
        customValidation: (value) => /^\d{16}$/.test(value),
      },
      expirationDate: {
        required: page === 6,
        customValidation: (value) => new Date(value) > new Date(),
      },
      cvv: {
        required: page === 6,
        customValidation: (value) => /^\d{3}$/.test(value),
      },
    });

    if (Object.keys(newErrors).length === 0) {
      if (page === 1) {
        try {
          const axiosInstance = axios.create({
            baseURL: "http://13.48.136.194/api",
          });

          const response = await axiosInstance.post("/otp/send-otp", {
            phoneNumber: `${areaCode}${formData.phoneNumber}`,
          });
          setSentOtp(response.data.otp);
          setPage(2);
        } catch (error) {
          console.error("Error sending OTP:", error);
          setErrors({ phoneNumber: "Failed to send OTP. Please try again." });
        }
      } else if (page === 2) {
        const receivedOtp = formData.otp.join("");
        try {
          const axiosInstance = axios.create({
            baseURL: "http://13.48.136.194/api",
          });
          const response = await axiosInstance.post("/otp/verify-otp", {
            phoneNumber: `${areaCode}${formData.phoneNumber}`,
            receivedOtp,
          });
          if (response.data.message === "OTP verified successfully") {
            setPage(3);
          } else {
            setErrors({ otp: "שגוי OTP" });
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 400) {
              setErrors({ otp: "שגוי OTP" });
            } else {
              console.error("Error verifying OTP:", error);
              setErrors({ otp: "שגוי OTP" });
            }
          } else {
            console.error("Unknown error verifying OTP:", error);
            setErrors({ otp: "An unknown error occurred. Please try again." });
          }
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

  const handleCloseTerms = () => setTermsOpen(false);
  const handleOpenTerms = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    setTermsOpen(true);
  };

  const handleBack = () => {
    setErrors({});
    setPage((prevPage) => prevPage - 1);
  };

  const handleSubmit = async () => {
    console.log("Submitting form with data:", formData);

    const { otp, ...dataWithoutOtp } = formData;

    try {
      const axiosInstance = axios.create({
        //baseURL: "http://localhost:3000/api",
        baseURL: "http://13.48.136.194/api",
      });
      const response = await axiosInstance.post(
        "/users/signup",
        dataWithoutOtp
      );
      console.log("Sign up successful:", response);
      navigate("/success");
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const backendErrors: FormErrors = {};
        const field = error.response.data.field as keyof ISignUpFormData;
        backendErrors[field] = error.response.data.message;
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
  ) => {
    if (id === "bank") {
      return (
        <>
          <TextField
            fullWidth
            id={id}
            label={label}
            name={id}
            margin="normal"
            select
            value={formData[id]}
            onChange={handleBankChange}
            error={!!errors[id]}
            helperText={errors[id]}
            InputLabelProps={{
              shrink: Boolean(formData[id]),
            }}
            {...otherProps}
          >
            {bankOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {isCustomBank && (
            <TextField
              fullWidth
              id="customBank"
              label="Enter Bank Name"
              name="bank"
              margin="normal"
              autoComplete="off"
              onChange={handleChange}
              value={formData.bank || ""}
              error={!!errors.bank}
              helperText={errors.bank}
              InputLabelProps={{
                shrink: Boolean(formData.bank),
              }}
              inputProps={{ maxLength: 50 }}
            />
          )}
        </>
      );
    }

    return (
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
  };

  return (
    <Box sx={outerContainer}>
      <Container sx={innerContainer}>
        <Stepper
          activeStep={page - 1}
          alternativeLabel
          sx={{
            minHeight: 150,
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <LinearProgress
          variant="determinate"
          value={(page - 1) * (100 / (steps.length - 1))}
        />
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
              {errors.otp && (
                <Typography color="error" sx={{ textAlign: "right" }}>
                  {errors.otp}
                </Typography>
              )}
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
                  disabled={!!errors.email}
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
                    height: 400,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                    overflow: "auto",
                  }}
                >
                  <IconButton
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={handleCloseTerms}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography
                    id="terms-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ textAlign: "right" }}
                  >
                    ראה תנאי שימוש{" "}
                  </Typography>
                  <Typography
                    id="terms-modal-description"
                    sx={{ mt: 2, textAlign: "right" }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: TermAndConditions }}
                    />
                  </Typography>
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
              {renderField("creditCardName", resources.creditCardName)}
              {renderField("bank", resources.Bank)}
              {isCustomBank && renderField("bank", "Enter Bank Name")}
              {renderField("branch", resources.branch)}
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

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Container,
//   Stepper,
//   Step,
//   StepLabel,
//   LinearProgress,
//   TextFieldProps,
//   FormControlLabel,
//   Checkbox,
//   Link,
//   Modal,
//   MenuItem,
// } from "@mui/material";
// import { ISignUpFormData } from "../../data/types";
// import resources from "../../resources/resources.json";
// import {
//   outerContainer,
//   innerContainer,
//   formContainer,
//   buttonBox,
//   button,
//   title,
//   subtitle,
// } from "./SignUp.style";
// import OtpInput from "../../components/OtpInput/OtpInput";
// import { TermAndConditions } from "./TermAndCondition";

// type FormErrors = Partial<Record<keyof ISignUpFormData, string>>;

// const bankOptions = [
//   { value: "בנק לאומי (10)", label: "בנק לאומי (10)" },
//   { value: "הבנק הבינלאומי הראשון (31)", label: "הבנק הבינלאומי הראשון (31)" },
//   {
//     value: "בנק של קופת העובד הלאומי (48)",
//     label: "בנק של קופת העובד הלאומי (48)",
//   },
//   //{ value: "אחר", label: "אחר" },
// ];

// const steps = [
//   "Phone Number",
//   "Verify OTP",
//   "Email and Password",
//   "Profile Details",
//   "Bank Details",
//   "Credit Card Details",
// ];

// const SignUp: React.FC = () => {
//   const navigate = useNavigate();
//   const [page, setPage] = useState(1);
//   const [formData, setFormData] = useState<ISignUpFormData>({
//     phoneNumber: "",
//     otp: ["", "", "", ""],
//     email: "",
//     password: "",
//     firstName: "",
//     lastName: "",
//     dateOfBirth: "",
//     companyName: "",
//     businessID: "",
//     agreedToTerms: false,
//     creditCardName: "",
//     bank: "",
//     branch: "",
//     accountNumber: "",
//     creditCardNumber: "",
//     expirationDate: "",
//     cvv: "",
//   });
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [areaCode, setAreaCode] = useState("+972");
//   const [sentOtp, setSentOtp] = useState("");
//   const [isTermsOpen, setTermsOpen] = useState(false);
//   const [isCustomBank, setIsCustomBank] = useState(false);

//   const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     if (value === "אחר") {
//       setIsCustomBank(true);
//       setFormData({ ...formData, bank: "" });
//     } else {
//       setIsCustomBank(false);
//       setFormData({ ...formData, bank: value });
//       console.log(sentOtp + "test");
//     }
//   };

//   const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (name === "email") {
//       try {
//         const axiosInstance = axios.create({
//           //baseURL: "http://13.48.136.194/api",
//           baseURL: "http://localhost:3000/api",
//         });
//         const response = await axiosInstance.post(
//           //"http://13.48.136.194/api/check-email",
//           "users/check-email",
//           { email: value }
//         );
//         if (response.data.exists) {
//           setErrors({ email: "User already exists" });
//         } else {
//           setErrors((prevErrors) => {
//             const newErrors = { ...prevErrors };
//             delete newErrors.email;
//             return newErrors;
//           });
//         }
//       } catch (error) {
//         console.error("Error checking email:", error);
//         setErrors({ email: "Failed to check email. Please try again." });
//       }
//     }
//   };

//   const handleAreaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setAreaCode(e.target.value);
//   };

//   const handleOtpChange = (index: number, value: string) => {
//     const newOtp = [...formData.otp];
//     newOtp[index] = value;
//     setFormData({ ...formData, otp: newOtp });
//   };

//   const validateFields = (
//     fields: Partial<
//       Record<
//         keyof ISignUpFormData,
//         {
//           required: boolean;
//           min?: number;
//           max?: number;
//           customValidation?: (value: string) => boolean;
//         }
//       >
//     >
//   ) => {
//     const newErrors: FormErrors = {};
//     Object.keys(fields).forEach((field) => {
//       const key = field as keyof ISignUpFormData;
//       const value = formData[key];

//       if (fields[key]?.required && !value) {
//         newErrors[key] = `${
//           resources[key as keyof typeof resources]
//         } is required`;
//       } else if (
//         value &&
//         typeof value === "string" &&
//         fields[key]?.min !== undefined &&
//         value.length < fields[key]!.min!
//       ) {
//         newErrors[key] = `${
//           resources[key as keyof typeof resources]
//         } must be at least ${fields[key]!.min!} characters`;
//       } else if (
//         value &&
//         typeof value === "string" &&
//         fields[key]?.max !== undefined &&
//         value.length > fields[key]!.max!
//       ) {
//         newErrors[key] = `${
//           resources[key as keyof typeof resources]
//         } cannot exceed ${fields[key]!.max!} characters`;
//       } else if (
//         value &&
//         typeof value === "string" &&
//         fields[key]?.customValidation &&
//         !fields[key]!.customValidation!(value)
//       ) {
//         newErrors[key] = `${
//           resources[key as keyof typeof resources]
//         } is not valid`;
//       }
//     });
//     return newErrors;
//   };
//   const handleNext = async () => {
//     setErrors({});

//     const newErrors = validateFields({
//       phoneNumber: {
//         required: page === 1,
//         min: 9,
//         max: 9,
//         customValidation: (value) =>
//           /^(50|52|53|54|55|57|58)\d{7}$/.test(value),
//       },
//       otp: { required: page === 2 },
//       email: {
//         required: page === 3,
//         customValidation: (value) =>
//           /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
//       },
//       password: { required: page === 3, min: 12 },
//       firstName: {
//         required: page === 4,
//         customValidation: (value) => /^[a-zA-Z]{1,50}$/.test(value),
//       },
//       lastName: {
//         required: page === 4,
//         customValidation: (value) => /^[a-zA-Z]{1,50}$/.test(value),
//       },
//       dateOfBirth: {
//         required: page === 4,
//         customValidation: (value) => new Date(value) < new Date(),
//       },
//       companyName: {
//         required: page === 4,
//         customValidation: (value) => /^[a-zA-Z0-9]{1,50}$/.test(value),
//       },
//       businessID: {
//         required: page === 4,
//         customValidation: (value) => /^\d{8,9}$/.test(value),
//       },
//       agreedToTerms: { required: page === 4 },
//       creditCardName: {
//         required: page === 5,
//         customValidation: (value) => /^[a-zA-Z]{1,50}$/.test(value),
//       },
//       bank: { required: page === 5 },
//       branch: {
//         required: page === 5,
//         customValidation: (value) => /^\d{3}$/.test(value),
//       },
//       accountNumber: {
//         required: page === 5,
//         customValidation: (value) => /^\d{1,9}$/.test(value),
//       },
//       creditCardNumber: {
//         required: page === 6,
//         customValidation: (value) => /^\d{16}$/.test(value),
//       },
//       expirationDate: {
//         required: page === 6,
//         customValidation: (value) => new Date(value) > new Date(),
//       },
//       cvv: {
//         required: page === 6,
//         customValidation: (value) => /^\d{3}$/.test(value),
//       },
//     });

//     if (Object.keys(newErrors).length === 0) {
//       console.log(formData.phoneNumber);

//       if (page === 1) {
//         try {
//           const axiosInstance = axios.create({
//             baseURL: "http://localhost:3000/api",
//           });

//           const response = await axiosInstance.post("/otp/send-otp", {
//             phoneNumber: `${areaCode}${formData.phoneNumber}`,
//           });
//           setSentOtp(response.data.otp);
//           setPage(2);
//         } catch (error) {
//           console.error("Error sending OTP:", error);
//           setErrors({ phoneNumber: "Failed to send OTP. Please try again." });
//         }
//       } else if (page === 2) {
//         const receivedOtp = formData.otp.join("");
//         try {
//           const axiosInstance = axios.create({
//             baseURL: "http://localhost:3000/api",
//           });
//           const response = await axiosInstance.post("/otp/verify-otp", {
//             phoneNumber: `${areaCode}${formData.phoneNumber}`,
//             receivedOtp,
//           });
//           if (response.data.message === "OTP verified successfully") {
//             setPage(3);
//           } else {
//             setErrors({ otp: "שגוי OTP" });
//           }
//         } catch (error) {
//           if (axios.isAxiosError(error)) {
//             if (error.response && error.response.status === 400) {
//               setErrors({ otp: "שגוי OTP" });
//             } else {
//               console.error("Error verifying OTP:", error);
//               setErrors({ otp: "שגוי OTP" });
//             }
//           } else {
//             console.error("Unknown error verifying OTP:", error);
//             setErrors({ otp: "An unknown error occurred. Please try again." });
//           }
//         }
//       } else if (page === 6) {
//         await handleSubmit();
//       } else {
//         setPage((prevPage) => prevPage + 1);
//       }
//     } else {
//       setErrors(newErrors);
//     }
//   };

//   // const handleNext = async () => {
//   //   setErrors({});

//   //   const newErrors = validateFields({
//   //     phoneNumber: {
//   //       required: page === 1,
//   //       min: 9,
//   //       max: 9,
//   //       customValidation: (value) =>
//   //         /^(50|52|53|54|55|57|58)\d{7}$/.test(value),
//   //     },
//   //     otp: { required: page === 2 },
//   //     email: {
//   //       required: page === 3,
//   //       customValidation: (value) =>
//   //         /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
//   //     },
//   //     password: { required: page === 3, min: 12 },
//   //     firstName: {
//   //       required: page === 4,
//   //       customValidation: (value) => /^[a-zA-Z]{1,50}$/.test(value),
//   //     },
//   //     lastName: {
//   //       required: page === 4,
//   //       customValidation: (value) => /^[a-zA-Z]{1,50}$/.test(value),
//   //     },
//   //     dateOfBirth: {
//   //       required: page === 4,
//   //       customValidation: (value) => new Date(value) < new Date(),
//   //     },
//   //     companyName: {
//   //       required: page === 4,
//   //       customValidation: (value) => /^[a-zA-Z0-9]{1,50}$/.test(value),
//   //     },
//   //     businessID: {
//   //       required: page === 4,
//   //       customValidation: (value) => /^\d{8,9}$/.test(value),
//   //     },
//   //     agreedToTerms: { required: page === 4 },
//   //     creditCardName: {
//   //       required: page === 5,
//   //       customValidation: (value) => /^[a-zA-Z]{1,50}$/.test(value),
//   //     },
//   //     bank: { required: page === 5 },
//   //     branch: {
//   //       required: page === 5,
//   //       customValidation: (value) => /^\d{3}$/.test(value),
//   //     },
//   //     accountNumber: {
//   //       required: page === 5,
//   //       customValidation: (value) => /^\d{1,9}$/.test(value),
//   //     },
//   //     creditCardNumber: {
//   //       required: page === 6,
//   //       customValidation: (value) => /^\d{16}$/.test(value),
//   //     },
//   //     expirationDate: {
//   //       required: page === 6,
//   //       customValidation: (value) => new Date(value) > new Date(),
//   //     },
//   //     cvv: {
//   //       required: page === 6,
//   //       customValidation: (value) => /^\d{3}$/.test(value),
//   //     },
//   //   });

//   //   if (Object.keys(newErrors).length === 0) {
//   //     console.log(formData.phoneNumber);

//   //     if (page === 1) {
//   //       try {
//   //         const axiosInstance = axios.create({
//   //           //baseURL: "http://13.48.136.194/api",
//   //           baseURL: "http://localhost:3000/api",
//   //         });

//   //         const response = await axiosInstance.post("/otp/send-otp", {
//   //           phoneNumber: `${areaCode}${formData.phoneNumber}`,
//   //         });
//   //         setSentOtp(response.data.otp);
//   //         setPage(2);
//   //       } catch (error) {
//   //         console.error("Error sending OTP:", error);
//   //         setErrors({ phoneNumber: "Failed to send OTP. Please try again." });
//   //       }
//   //     } else if (page === 2) {
//   //       const receivedOtp = formData.otp.join("");
//   //       try {
//   //         const axiosInstance = axios.create({
//   //           //baseURL: "http://13.48.136.194/api",
//   //           baseURL: "http://localhost:3000/api",
//   //         });
//   //         const response = await axiosInstance.post("/otp/verify-otp", {
//   //           phoneNumber: `${areaCode}${formData.phoneNumber}`,
//   //           receivedOtp,
//   //         });
//   //         if (response.data.message === "OTP verified successfully") {
//   //           setPage(3);
//   //         } else {
//   //           setErrors({ otp: "OTP שגוי." });
//   //         }
//   //       } catch (error) {
//   //         console.error("Error verifying OTP:", error);
//   //         setErrors({ otp: "Invalid OTP. Please try again." });
//   //       }
//   //     } else if (page === 6) {
//   //       await handleSubmit();
//   //     } else {
//   //       setPage((prevPage) => prevPage + 1);
//   //     }
//   //   } else {
//   //     setErrors(newErrors);
//   //   }
//   // };

//   const handleCloseTerms = () => setTermsOpen(false);
//   const handleOpenTerms = (
//     e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
//   ) => {
//     e.preventDefault();
//     setTermsOpen(true);
//   };

//   const handleBack = () => {
//     setErrors({});
//     setPage((prevPage) => prevPage - 1);
//   };

//   const handleSubmit = async () => {
//     console.log("Submitting form with data:", formData);

//     const { otp, ...dataWithoutOtp } = formData;

//     try {
//       const axiosInstance = axios.create({
//         //baseURL: "http://13.48.136.194/api",
//         baseURL: "http://localhost:3000/api",
//       });
//       const response = await axiosInstance.post(
//         "/users/signup",
//         dataWithoutOtp
//       );
//       console.log("Sign up successful:", response);
//       navigate("/success");
//     } catch (error: any) {
//       if (
//         error.response &&
//         error.response.data &&
//         error.response.data.message
//       ) {
//         const backendErrors: FormErrors = {};
//         const field = error.response.data.field as keyof ISignUpFormData;
//         backendErrors[field] = error.response.data.message;
//         setErrors(backendErrors);
//       } else {
//         console.error("Sign up failed:", error);
//       }
//     }
//   };

//   // const renderField = (
//   //   id: keyof ISignUpFormData,
//   //   label: string,
//   //   type: string = "text",
//   //   otherProps: TextFieldProps = {}
//   // ) => {
//   //   if (id === "bank") {
//   //     return (
//   //       <>
//   //         <TextField
//   //           fullWidth
//   //           id={id}
//   //           label={label}
//   //           name={id}
//   //           margin="normal"
//   //           select
//   //           value={formData[id]}
//   //           onChange={handleBankChange}
//   //           error={!!errors[id]}
//   //           helperText={errors[id]}
//   //           InputLabelProps={{
//   //             shrink: Boolean(formData[id]),
//   //           }}
//   //           {...otherProps}
//   //         >
//   //           {bankOptions.map((option) => (
//   //             <MenuItem key={option.value} value={option.value}>
//   //               {option.label}
//   //             </MenuItem>
//   //           ))}
//   //         </TextField>
//   //         {isCustomBank && (
//   //           <TextField
//   //             fullWidth
//   //             id="customBank"
//   //             label="Enter Bank Name"
//   //             name="bank"
//   //             margin="normal"
//   //             autoComplete="off"
//   //             onChange={handleChange}
//   //             value={formData.bank || ""}
//   //             error={!!errors.bank}
//   //             helperText={errors.bank}
//   //             InputLabelProps={{
//   //               shrink: Boolean(formData.bank),
//   //             }}
//   //             inputProps={{ maxLength: 50 }}
//   //           />
//   //         )}
//   //       </>
//   //     );
//   //   }

//   //   return (
//   //     <TextField
//   //       fullWidth
//   //       id={id}
//   //       label={label}
//   //       name={id}
//   //       type={type}
//   //       margin="normal"
//   //       autoComplete="off"
//   //       onChange={handleChange}
//   //       value={formData[id] || ""}
//   //       error={!!errors[id]}
//   //       helperText={errors[id]}
//   //       InputLabelProps={{
//   //         shrink: Boolean(formData[id]),
//   //       }}
//   //       {...otherProps}
//   //     />
//   //   );
//   // };

//   const renderField = (
//     id: keyof ISignUpFormData,
//     label: string,
//     type: string = "text",
//     otherProps: TextFieldProps = {}
//   ) => {
//     if (id === "bank") {
//       return (
//         <>
//           <TextField
//             fullWidth
//             id={id}
//             label={label}
//             name={id}
//             margin="normal"
//             select
//             value={formData[id]}
//             onChange={handleBankChange}
//             error={!!errors[id]}
//             helperText={errors[id]}
//             InputLabelProps={{
//               shrink: Boolean(formData[id]),
//             }}
//             {...otherProps}
//           >
//             {bankOptions.map((option) => (
//               <MenuItem key={option.value} value={option.value}>
//                 {option.label}
//               </MenuItem>
//             ))}
//           </TextField>
//           {isCustomBank && (
//             <TextField
//               fullWidth
//               id="customBank"
//               label="Enter Bank Name"
//               name="bank"
//               margin="normal"
//               autoComplete="off"
//               onChange={handleChange}
//               value={formData.bank || ""}
//               error={!!errors.bank}
//               helperText={errors.bank}
//               InputLabelProps={{
//                 shrink: Boolean(formData.bank),
//               }}
//               inputProps={{ maxLength: 50 }}
//             />
//           )}
//         </>
//       );
//     }

//     return (
//       <TextField
//         fullWidth
//         id={id}
//         label={label}
//         name={id}
//         type={type}
//         margin="normal"
//         autoComplete="off"
//         onChange={handleChange}
//         value={formData[id] || ""}
//         error={!!errors[id]}
//         helperText={errors[id]}
//         InputLabelProps={{
//           shrink: Boolean(formData[id]),
//         }}
//         {...otherProps}
//       />
//     );
//   };

//   // Inside your form for the OTP step
//   {
//     page === 2 && (
//       <Box sx={formContainer}>
//         <Typography variant="h4" component="h1" sx={title}>
//           {resources.VerifyYourPhoneNumberTitle}
//         </Typography>
//         <Typography variant="subtitle1" sx={subtitle}>
//           {resources.VerifyYourPhoneNumberSubtitle}
//         </Typography>
//         <form
//           autoComplete="off"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleNext();
//           }}
//         >
//           <OtpInput otp={formData.otp} handleChange={handleOtpChange} />
//           {errors.otp && <Typography color="error">{errors.otp}</Typography>}
//           <Box sx={buttonBox}>
//             <Button variant="outlined" sx={button} onClick={handleBack}>
//               {resources.Back}
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               sx={button}
//               type="submit"
//             >
//               {resources.Next}
//             </Button>
//           </Box>
//         </form>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={outerContainer}>
//       <Container sx={innerContainer}>
//         <Stepper
//           activeStep={page - 1}
//           alternativeLabel
//           sx={{
//             minHeight: 150,
//             //width: "80%",
//           }}
//         >
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//         <LinearProgress
//           variant="determinate"
//           value={(page - 1) * (100 / (steps.length - 1))}
//         />
//         {page === 1 && (
//           <Box sx={formContainer}>
//             <Typography variant="h4" component="h1" sx={title}>
//               {resources.AddingYourPhoneNumberTitle}
//             </Typography>
//             <Typography variant="subtitle1" sx={subtitle}>
//               {resources.AddingYourPhoneNumberSubtitle}
//             </Typography>
//             <form
//               autoComplete="off"
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleNext();
//               }}
//             >
//               <TextField
//                 fullWidth
//                 id="areaCode"
//                 label="Area Code"
//                 name="areaCode"
//                 margin="normal"
//                 select
//                 SelectProps={{ native: true }}
//                 value={areaCode}
//                 onChange={handleAreaCodeChange}
//               >
//                 <option value="+972">+972</option>
//                 <option value="+1">+1</option>
//                 <option value="+44">+44</option>
//                 <option value="+91">+91</option>
//               </TextField>
//               {renderField("phoneNumber", resources.phoneNumber)}
//               <Box sx={buttonBox}>
//                 <Button
//                   variant="outlined"
//                   onClick={() => navigate("/")}
//                   sx={button}
//                 >
//                   {resources.Back}
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   sx={button}
//                   type="submit"
//                 >
//                   {resources.Next}
//                 </Button>
//               </Box>
//             </form>
//           </Box>
//         )}
//         {page === 2 && (
//           <Box sx={formContainer}>
//             <Typography variant="h4" component="h1" sx={title}>
//               {resources.VerifyYourPhoneNumberTitle}
//             </Typography>
//             <Typography variant="subtitle1" sx={subtitle}>
//               {resources.VerifyYourPhoneNumberSubtitle}
//             </Typography>
//             <form
//               autoComplete="off"
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleNext();
//               }}
//             >
//               <OtpInput otp={formData.otp} handleChange={handleOtpChange} />
//               {errors.otp && (
//                 <Typography color="error" sx={{ textAlign: "right" }}>
//                   {errors.otp}
//                 </Typography>
//               )}
//               <Box sx={buttonBox}>
//                 <Button variant="outlined" sx={button} onClick={handleBack}>
//                   {resources.Back}
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   sx={button}
//                   type="submit"
//                 >
//                   {resources.Next}
//                 </Button>
//               </Box>
//             </form>
//           </Box>
//         )}

//         {page === 3 && (
//           <Box sx={formContainer}>
//             <Typography variant="h4" component="h1" sx={title}>
//               {resources.MailAndPassword}
//             </Typography>
//             <form
//               autoComplete="off"
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleNext();
//               }}
//             >
//               {renderField("email", resources.email, "email")}
//               {renderField("password", resources.password, "password")}
//               <Box sx={buttonBox}>
//                 <Button variant="outlined" sx={button} onClick={handleBack}>
//                   {resources.Back}
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   sx={button}
//                   type="submit"
//                   disabled={!!errors.email}
//                 >
//                   {resources.Next}
//                 </Button>
//               </Box>
//             </form>
//           </Box>
//         )}
//         {page === 4 && (
//           <Box sx={formContainer}>
//             <Typography variant="h4" component="h1" sx={title}>
//               {resources.DefinitionOfProfileTitle}
//             </Typography>
//             <Typography variant="subtitle1" sx={subtitle}>
//               {resources.DefinitionOfProfileSubtitle}
//             </Typography>
//             <form
//               autoComplete="off"
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleNext();
//               }}
//             >
//               {renderField("firstName", resources.firstName)}
//               {renderField("lastName", resources.lastName)}
//               {renderField("dateOfBirth", resources.dateOfBirth, "date", {
//                 InputLabelProps: { shrink: true },
//               })}
//               {renderField("companyName", resources.companyName)}
//               {renderField("businessID", resources.businessID)}
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     name="agreedToTerms"
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         agreedToTerms: e.target.checked,
//                       })
//                     }
//                     checked={formData.agreedToTerms}
//                   />
//                 }
//                 label={resources.Agree}
//               />
//               <Link href="#" variant="body2" onClick={handleOpenTerms}>
//                 ראה תנאי שימוש{" "}
//               </Link>
//               <Modal
//                 open={isTermsOpen}
//                 onClose={handleCloseTerms}
//                 aria-labelledby="terms-modal-title"
//                 aria-describedby="terms-modal-description"
//               >
//                 <Box
//                   sx={{
//                     position: "absolute" as const,
//                     top: "50%",
//                     left: "50%",
//                     transform: "translate(-50%, -50%)",
//                     width: 300,
//                     height: 400,
//                     bgcolor: "background.paper",
//                     border: "2px solid #000",
//                     boxShadow: 24,
//                     p: 4,
//                     overflow: "auto",
//                   }}
//                 >
//                   <Typography
//                     id="terms-modal-title"
//                     variant="h6"
//                     component="h2"
//                     sx={{ textAlign: "right" }}
//                   >
//                     ראה תנאי שימוש{" "}
//                   </Typography>
//                   <Typography
//                     id="terms-modal-description"
//                     sx={{ mt: 2, textAlign: "right" }}
//                   >
//                     <div
//                       dangerouslySetInnerHTML={{ __html: TermAndConditions }}
//                     />
//                   </Typography>
//                   <Button onClick={handleCloseTerms}>Close</Button>
//                 </Box>
//               </Modal>
//               <Box sx={buttonBox}>
//                 <Button variant="outlined" sx={button} onClick={handleBack}>
//                   {resources.Back}
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   sx={button}
//                   type="submit"
//                   disabled={!formData.agreedToTerms}
//                 >
//                   {resources.Next}
//                 </Button>
//               </Box>
//             </form>
//           </Box>
//         )}
//         {page === 5 && (
//           <Box sx={formContainer}>
//             <Typography variant="h4" component="h1" sx={title}>
//               {resources.BankAccountDetailsTitle}
//             </Typography>
//             <Typography variant="subtitle1" sx={subtitle}>
//               {resources.DefinitionOfProfileSubtitle}
//             </Typography>
//             <form
//               autoComplete="off"
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleNext();
//               }}
//             >
//               {renderField("creditCardName", resources.accountName)}
//               {renderField("bank", resources.Bank)}
//               {isCustomBank && renderField("bank", "Enter Bank Name")}
//               {renderField("branch", resources.branchNumber)}
//               {renderField("accountNumber", resources.accountNumber)}
//               <Box sx={buttonBox}>
//                 <Button variant="outlined" sx={button} onClick={handleBack}>
//                   {resources.Back}
//                 </Button>
//                 <Button variant="contained" sx={button} type="submit">
//                   {resources.Next}
//                 </Button>
//               </Box>
//             </form>
//           </Box>
//         )}
//         {page === 6 && (
//           <Box sx={formContainer}>
//             <Typography variant="h4" component="h1" sx={title}>
//               {resources.CreditCardDetailsTitle}
//             </Typography>
//             <Typography variant="subtitle1" sx={subtitle}>
//               {resources.DefinitionOfProfileSubtitle}
//             </Typography>
//             <form
//               autoComplete="off"
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSubmit();
//               }}
//             >
//               {renderField("creditCardNumber", resources.creditCardNumber)}
//               {renderField(
//                 "expirationDate",
//                 resources.expirationDate,
//                 "month",
//                 {
//                   InputLabelProps: { shrink: true },
//                 }
//               )}
//               {renderField("cvv", resources.CVV)}
//               <Box sx={buttonBox}>
//                 <Button variant="outlined" sx={button} onClick={handleBack}>
//                   {resources.Back}
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   type="submit"
//                   sx={button}
//                 >
//                   {resources.FinishRegistration}
//                 </Button>
//               </Box>
//             </form>
//           </Box>
//         )}
//       </Container>
//     </Box>
//   );
// };

// export default SignUp;
