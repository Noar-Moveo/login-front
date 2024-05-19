import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles";

export const outerContainer: SxProps = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
};

export const innerContainer: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  //border: "5px solid red",
};


export const formContainer: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
};

export const buttonBox: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 2,
};

export const button: SxProps<Theme> = {
  width: "48%",
};

export const title: SxProps<Theme> = {
  fontFamily: "Montserrat",
  fontSize: "25px",
  fontWeight: 400,
  lineHeight: "30.48px",
  textAlign: "left",
};

export const subtitle: SxProps<Theme> = {
  fontFamily: "Montserrat",
  fontSize: "15px",
  fontWeight: 400,
  lineHeight: "18.29px",
  textAlign: "left",
};

// import { SxProps } from "@mui/system";

// export const outerContainer: SxProps = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   height: "100vh",
//   width: "100vw",
// };

// export const innerContainer: SxProps = {
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   width: "100%",
//   //border: "5px solid red",
// };

// export const formContainer: SxProps = {
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   width: "100%",
//   maxWidth: "600px",
//   //border: "5px solid red",
// };

// export const buttonBox: SxProps = {
//   display: "flex",
//   justifyContent: "space-between",
//   width: "100%",
//   marginTop: "20px",
//   //border: "5px solid blue",
// };

// export const button: SxProps = {
//   width: "48%",
// };
