import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { setDomMessage } from "../slices/dominionSlice";
import { useEffect, useState } from "react";
import { getReversas, updateReversas } from "../api/dominionAPI";

function ReversaView() {
  const { domToken, domMessage } = useSelector((state) => state.dominion);
  const [rut, setRut] = useState('');
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState([]);

  const renderAlert = () => (
    <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
      {domMessage}
    </Alert>
  );

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { value } = e.target;
    setRut(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = rut;
    try {
      const response = await getReversas(domToken, payload);
      console.log(response)
      setData(response.data);

      const formatted = response.data.map(item => ({
        print: 0,
        entrega: item.entregado !== undefined ? item.entregado : 1,
        fuente: item.fuente !== undefined ? item.fuente : 1,
        id: item.id,
      }));

      setFormattedData(formatted); // Guardamos los datos formateados
      setLoading(false);
    } catch (error) {
      dispatch(setDomMessage("Se ha generado un error en el servidor"));
      setOpen(true);
      setLoading(false);
    }
  };

  const handleCheckboxChange = (id, type) => {
    setFormattedData((prevFormattedData) => {
      return prevFormattedData.map((item) =>
        item.id === id
          ? { ...item, [type]: item[type] === 1 ? 0 : 1 }
          : item
      );
    });
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log(formattedData)
      const res = await updateReversas(domToken, formattedData);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const renderTableHeaders = () => (
    <TableHead>
      <TableRow>
        {["FECHA", "ORDEN", "ANI", "EQUIPO", "SERIE", "ENTREGADO", "FUENTE"].map((header) => (
          <TableCell
            key={header}
            align="center"
            sx={{ background: "#d8d8d8", fontWeight: "bold" }}
          >
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const renderTableBody = () => {
    if (data && data.length > 0) {
      return (
        <TableBody>
          {data.map((item) => {
            const formattedItem = formattedData.find((i) => i.id === item.id) || {};
            return (
              <TableRow key={item.id}>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  {item.fecha}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  {item.orden}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  {item.ANI}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  {item.equipo}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  {item.serie}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Checkbox
                    checked={formattedItem.entrega === 1} // Usar formattedData para determinar el estado
                    onChange={() => handleCheckboxChange(item.id, "entrega")}
                  />
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "12px" }}>
                  <Checkbox
                    checked={formattedItem.fuente === 1} // Usar formattedData para determinar el estado
                    onChange={() => handleCheckboxChange(item.id, "fuente")}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      );
    } else {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} align="center">
              No hay datos disponibles
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
  };

  const renderTable = () => {
    if (loading) {
      return (
        <CardContent
          sx={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </CardContent>
      );
    }

    return (
      <CardContent>
        <Card>
          <CardHeader
            title="LISTA DE REVERSAS POR TRABAJADOR"
            sx={{
              backgroundColor: "#0b2f6d",
              color: "white",
              padding: "10px",
              borderBottom: "1px solid #ddd",
              fontWeight: "bold",
              textAlign: "center",
            }}
          />
          <TableContainer
            component={Paper}
            sx={{ width: "100%", height: "100%", overflow: "auto" }}
          >
            <Table stickyHeader>
              {renderTableHeaders()}
              {renderTableBody()}
            </Table>
          </TableContainer>
        </Card>
      </CardContent>
    );
  };

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
      {open && renderAlert()}
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
            <TextField
              required
              sx={{ minWidth: "400px" }}
              id="rut"
              label="RUT TRABAJADOR"
              type="text"
              name="rut"
              variant="outlined"
              value={rut}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBoxIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ background: "#0b2f6d" }}
            >
              CONSULTAR
            </Button>
          </Box>
        </form>
      </CardContent>
      <Box sx={{ width: "80%" }}>{renderTable()}</Box>
      <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              sx={{ background: "#0b2f6d", width:'250px' }}
              onClick={handleSubmitUpdate}
            >
              ACTUALIZAR INFORMACION
            </Button>
          </Box>
    </Box>
  );
}

export default ReversaView;
