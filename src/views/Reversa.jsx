import { Box, Alert, CardContent, Button, TextField, InputAdornment, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { setDomMessage } from "../slices/dominionSlice";
import { useEffect, useState } from "react";
import { getReversas } from "../api/dominionAPI";

function ReversaView() {
  const { domToken, domMessage } = useSelector((state) => state.dominion);
  const [form, setForm] = useState({ rut: "" });
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const renderAlert = () => (
    <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
      {domMessage}
    </Alert>
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = form.rut;
    try {
      const response = await getReversas(domToken, payload);
      console.log(response)
      setData(response.data);
      setLoading(false);
    } catch (error) {
      dispatch(setDomMessage("Se ha generado un error en el servidor"));
      setOpen(true);
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (loading) {
      return (
        <CardContent>
          <CircularProgress />
        </CardContent>
      );
    }
    
    if (data && data.length > 0) {
      return (
        <CardContent>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Orden</th>
                <th>ANI</th>
                <th>Equipo</th>
                <th>Serie</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.fecha}</td>
                  <td>{item.orden}</td>
                  <td>{item.ANI}</td>
                  <td>{item.equipo}</td>
                  <td>{item.serie}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      );
    } else {
      return (
        <CardContent>
          <h1>No hay información para mostrar</h1>
        </CardContent>
      );
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
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
              value={form.rut}
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
            <Button type="submit" variant="contained" sx={{ background: "#0b2f6d" }}>
              CONSULTAR
            </Button>
          </Box>
        </form>
      </CardContent>

      {renderTable()}
    </Box>
  );
}

export default ReversaView;
