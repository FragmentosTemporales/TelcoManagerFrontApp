import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
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
  import { useDispatch, useSelector } from "react-redux";
  import { useEffect, useState } from "react";
  import { setDomMessage } from "../slices/dominionSlice";
  import { getNumeros } from "../api/dominionAPI";
  
  function FilaReversaView() {
    const { domToken } = useSelector((state) => state.dominion);
    const [fila, setFila] = useState([]);

    const fetchLista = async () => {
      try {
        const res = await getNumeros(domToken);
  
        if (res && res.data) {
          const data = res.data;
          const filterFila = data.filter(
            (numero) => numero.estacion == "CALIDAD LOGISTICA"
          );
  
          setFila(filterFila);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      fetchLista();
    }, [domToken]);
  

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          paddingTop: 8,
          mt: 2,
        }}
      >

      </Box>
    );
  }
  
  export default FilaReversaView;
  