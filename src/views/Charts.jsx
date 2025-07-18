import {
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";

function Charts() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

    </Box>
  );
}

export default Charts;
