import {
  Box,
  Button,
  Card,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { updateNotificacion } from "../api/notificacionesAPI";

function NotificacionesView() {
  const authState = useSelector((state) => state.auth);
  const notificacionState = useSelector((state) => state.notificacion);
  const { token } = authState;
  const { data } = notificacionState;

  const updating = async (id) => {
    try {
      const data = { read: true };
      const res = await updateNotificacion(token, data, id);
      console.log(res)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        overflow: "auto",
        paddingTop: 8,
        paddingBottom: "50px",
      }}
    >
      <Box
        sx={{
          width: "80%",
          mt: 2,
          display: "flex",
          justifyContent: "start",
        }}
      ></Box>
      <>
        <Card
          sx={{
            width: "60%",
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            boxShadow: 5,
            textAlign: "center",
            borderRadius: "0px",
            minHeight: "250px",
            mt: 2,
          }}
        >
          <CardHeader
            title="NOTIFICACIONES"
            sx={{
              backgroundColor: "#0b2f6d",
              color: "white",
              padding: "10px",
              borderBottom: "1px solid #ddd",
              fontWeight: "bold",
            }}
          />
          <TableContainer
            component={Paper}
            sx={{ width: "100%", height: "100%", overflow: "auto" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["FECHA", "DESCRIPCION", "IR"].map((header) => (
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
              <TableBody>
                {data && data.length > 0 ? (
                  data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{row.fecha}</TableCell>
                      <TableCell align="center">{row.descri}</TableCell>
                      <TableCell align="center">
                        <Link to={row.nav_path}>
                          <Button
                            onClick={() => updating(row.notificacionID)}
                            variant="contained"
                            sx={{
                              width: 30,
                              height: 30,
                              minWidth: 30,
                              padding: 0,
                              background: "#0b2f6d",
                            }}
                          >
                            <FindInPageIcon />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No hay datos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </>
    </Box>
  );
}

export default NotificacionesView;
