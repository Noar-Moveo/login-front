import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LogoutIcon from "@mui/icons-material/Logout";

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any necessary data or tokens here if needed
    navigate("/");
  };

  return (
    <Container maxWidth="xs" sx={{ textAlign: "center", paddingTop: 4 }}>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle2" component="div">
          שלום
        </Typography>
      </Box>
      <Typography variant="h6" component="div">
        כמה לחייב?
      </Typography>
      <Typography variant="h4" component="div" sx={{ marginBottom: 2 }}>
        ₪0.00
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map((item) => (
          <Grid item xs={4} key={item}>
            <Button
              variant="contained"
              sx={{
                minWidth: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: item === "." ? "white" : "#f5f5f5",
                color: item === "." ? "black" : "inherit",
              }}
            >
              {item}
            </Button>
          </Grid>
        ))}
        <Grid item xs={4}>
          <IconButton
            sx={{
              minWidth: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#e0e0e0",
            }}
          >
            <CreditCardIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        sx={{
          marginTop: 2,
          backgroundColor: "#e0e0e0",
          color: "black",
          width: "100%",
        }}
      >
        המשך לחיוב
      </Button>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{
          marginTop: 1,
          color: "black",
          width: "100%",
        }}
      >
        הוספת פריטים
      </Button>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 2,
        }}
      >
        <IconButton>
          <PersonIcon />
        </IconButton>
        <IconButton>
          <CreditCardIcon />
        </IconButton>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            backgroundColor: "#e0e0e0",
            color: "black",
            width: "100%",
          }}
        >
          התנתקות
        </Button>
      </Box>
    </Container>
  );
};

export default SuccessPage;
