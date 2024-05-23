import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles";


export const outerContainer: SxProps = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
  textAlign: "right",
};

export const innerContainer: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  textAlign: "right",
  //border: "5px solid red",
};

export const formContainer: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  textAlign: "right",
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
  textAlign: "right",
};

export const subtitle: SxProps<Theme> = {
  fontFamily: "Montserrat",
  fontSize: "15px",
  fontWeight: 400,
  lineHeight: "18.29px",
  textAlign: "right",
  marginTop: "10px",
};

export const TermAndConditions_: SxProps<Theme> = {
  testAlign: "right",
};

