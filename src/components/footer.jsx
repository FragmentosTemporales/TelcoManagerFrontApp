import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  InputLabel,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
function Footer() {
  return (
    <Box
      sx={{
        display: "column",
        justifyContent: "center",
        textAlign:'center',
        paddingTop: 2
      }}
    >
      <Divider sx={{ width: "100%"}} />
      <Typography sx={{ width: "100%", mb: 1, background:'#f5f5f5', fontFamily:'initial' }}>Dominion Global - 2024</Typography>
    </Box>
  );
}
export default Footer;
