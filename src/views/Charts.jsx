import {
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  CardContent,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import {
  BarChart,
  Bar,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

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
