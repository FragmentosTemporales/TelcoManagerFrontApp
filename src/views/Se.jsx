import {
  Alert,
  Box,
  Chip,
  Paper,
  Card,
  CardHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSolicitudEstado } from "../api/seAPI";
import { onLoad, onLoading, setMessage } from "../slices/seSlice";

function SolicitudEstado() {
  const { token } = useSelector((state) => state.auth);
  const { message, data, is_loading, is_load } = useSelector((state) => state.se);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    dispatch(onLoading());
    try {
      const res = await getSolicitudEstado(token);
      dispatch(onLoad(res));
    } catch (error) {
      dispatch(setMessage(error));
      setOpen(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, token]);

  const renderAlert = () => (
    <Alert onClose={handleClose} severity="info" sx={{ marginTop: "2%", width: "90%" }}>
      {message}
    </Alert>
  );

  const renderSkeleton = () => (
    <Box
      sx={{
        width: "100%",
        height: "95vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Skeleton variant="rounded" width="90%" height="70%" sx={{ p: 3, m: 3 }} />
    </Box>
  );

  const renderTable = () => (
    <Card
      sx={{
        width: "90%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: "0px",
        minHeight: "250px",
        mt: 2,
      }}
    >
      <CardHeader
        title="LISTA DE ESTADOS DE SOLICITUD"
        sx={{
          backgroundColor: "#0b2f6d",
          color: "white",
          padding: "16px",
          borderBottom: "1px solid #ddd",
          textAlign: "center",
        }}
      />
      <TableContainer component={Paper} sx={{ width: "100%", height: "100%" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">SUBMOTIVO ID</TableCell>
              <TableCell align="center">DESCRIPCION</TableCell>
              <TableCell align="center">HABILITADO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row) => (
                <TableRow key={row.solicitudEstadoID}>
                  <TableCell align="center">{row.solicitudEstadoID}</TableCell>
                  <TableCell align="center">{row.descri}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.hab ? "True" : "False"}
                      color={row.hab ? "success" : "error"}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
        width: "100%",
        overflow: "auto",
        paddingTop: 6,
        paddingBottom: "50px",
      }}
    >
      {open && renderAlert()}
      {is_loading && !is_load ? renderSkeleton() : renderTable()}
    </Box>
  );
}

export default SolicitudEstado;