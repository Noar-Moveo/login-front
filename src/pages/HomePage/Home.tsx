import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Box, Typography, TextField } from "@mui/material";
import resources from "../../resources/resources.json";
import * as styles from "./Home.style";

const Home: React.FC = () => {
  const navigate = useNavigate();
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
            onClick={() => navigate("/login")}
            sx={styles.button}
          >
            {resources.Login}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
