import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Box, Typography, TextField } from "@mui/material";
import resources from "../../resources/resources.json";
import * as styles from "./Home.style";
import axios from "axios";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignupClick = () => {
    navigate("/signup", { state: { fromHome: true } });
  };

  const handleForgotPasswordClick = () => {
    navigate("/forgot-password");
  };

  const handleLoginClick = async () => {
    setError(null);
    try {
      const axiosInstance = axios.create({
        baseURL: "http://localhost:3000/api",
      });
      const response = await axiosInstance.post("/users/login", formData);
      console.log(response);
      navigate("/success", { state: { fromHome: true } });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      if (errorMessage.includes("This user has no account")) {
        setError("This user has no account.");
      } else if (errorMessage.includes("Invalid email or password")) {
        setError("Invalid email or password.");
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <Box sx={styles.outerContainer}>
      <Container maxWidth="sm" sx={styles.innerContainer}>
        <Typography variant="h3" component="h1" sx={styles.title}>
          {resources.Shaniez}
        </Typography>
        <TextField
          fullWidth
          label="כתובת מייל"
          name="email"
          type="email"
          margin="normal"
          onChange={handleChange}
          autoComplete="off"
        />
        <TextField
          fullWidth
          label="סיסמה"
          name="password"
          type="password"
          margin="normal"
          onChange={handleChange}
          autoComplete="off"
        />
        {error && (
          <Box sx={{ textAlign: "right", color: "red" }}>
            <Typography>{error}</Typography>
          </Box>
        )}
        <Box sx={styles.buttonBox}>
          <Button
            variant="contained"
            onClick={handleSignupClick}
            sx={styles.button}
          >
            {resources.SignUp}
          </Button>
          <Button
            variant="contained"
            onClick={handleLoginClick}
            sx={styles.button}
          >
            {resources.Login}
          </Button>
        </Box>
        <Box sx={{ textAlign: "right", marginTop: 2 }}>
          <Button onClick={handleForgotPasswordClick}>
            {resources.ForgotPassword}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Container, Button, Box, Typography, TextField } from "@mui/material";
// import resources from "../../resources/resources.json";
// import * as styles from "./Home.style";
// import axios from "axios";

// const Home: React.FC = () => {
//   const navigate = useNavigate();
//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSignupClick = () => {
//     navigate("/signup", { state: { fromHome: true } });
//   };

//   // const axiosInstance = axios.create({
//   //   // baseURL: "http://13.48.136.194/api",
//   //   baseURL: "http://localhost:3000/api",
//   // });

//   // const response = await axiosInstance.post("/otp/send-otp", {

//   const handleLoginClick = async () => {
//     setError(null);
//     try {
//       const axiosInstance = axios.create({
//         baseURL: "http://localhost:3000/api",
//       });
//       const response = await axiosInstance.post("/users/login", formData);
//       navigate("/success", { state: { fromHome: true } });
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || "An error occurred. Please try again.";
//       if (errorMessage.includes("This user has no account")) {
//         setError("This user has no account.");
//       } else if (errorMessage.includes("Invalid email or password")) {
//         setError("Invalid email or password.");
//       } else {
//         setError(errorMessage);
//       }
//     }
//   };

//   return (
//     <Box sx={styles.outerContainer} >
//       <Container maxWidth="sm" sx={styles.innerContainer}>
//         <Typography variant="h3" component="h1" sx={styles.title}>
//           {resources.Shaniez}
//         </Typography>
//         <TextField
//           fullWidth
//           label="כתובת מייל"
//           name="email"
//           type="email"
//           margin="normal"
//           onChange={handleChange}
//           autoComplete="off"
//         />
//         <TextField
//           fullWidth
//           label="סיסמה"
//           name="password"
//           type="password"
//           margin="normal"
//           onChange={handleChange}
//           autoComplete="off"
//         />
//         {error && (
//           <Box sx={{ textAlign: "right", color: "red" }}>
//             <Typography>{error}</Typography>
//           </Box>
//         )}{" "}
//         <Box sx={styles.buttonBox}>
//           <Button
//             variant="contained"
//             onClick={handleSignupClick}
//             sx={styles.button}
//           >
//             {resources.SignUp}
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleLoginClick}
//             sx={styles.button}
//           >
//             {resources.Login}
//           </Button>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default Home;
