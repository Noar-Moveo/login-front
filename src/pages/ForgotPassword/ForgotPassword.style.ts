import { SxProps } from "@mui/system";

export const outerContainer: SxProps = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
};

export const innerContainer: SxProps = {
  padding: 3,
  boxShadow: 3,
  borderRadius: 1,
  backgroundColor: "white",
};

export const title: SxProps = {
  textAlign: "center",
  marginBottom: 3,
};

export const buttonBox: SxProps = {
  display: "flex",
  justifyContent: "center",
  marginTop: 2,
};

export const button: SxProps = {
  minWidth: 120,
};
