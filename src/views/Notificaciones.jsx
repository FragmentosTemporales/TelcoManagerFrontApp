import {
  Box,
  Button,
  Card,
  Chip,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onLoad, onLoading } from "../slices/notificacionSlice";
import {
  updateNotificacion,
  getNotificaciones,
} from "../api/notificacionesAPI";

function NotificacionesView() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const notificacionState = useSelector((state) => state.notificacion);
  const { token } = authState;
  const { data } = notificacionState;

  const updating = async (id) => {
    try {
      const data = { read: true };
      await updateNotificacion(token, data, id);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      dispatch(onLoading());
      const res = await getNotificaciones(token);
      dispatch(onLoad(res));
    } catch (error) {
      console.error("Error fetching notificaciones:", error);
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
        minHeight: "85vh",
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
            borderRadius: "10px",
            minHeight: "250px",
            mt: 2,
          }}
        >
          <CardHeader
            title={
              <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                NOTIFICACIONES
              </Typography>
            }
            avatar={<CircleNotificationsIcon />}
            sx={{
              background: "#0b2f6d",
              color: "white",
              textAlign: "end",
            }}
          />
          <TableContainer
            component={Paper}
            sx={{ width: "100%", height: "100%", overflow: "auto" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["FECHA", "DESCRIPCION", "ESTADO", "IR"].map((header) => (
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
                        <Chip
                          label={row.read ? "Leído" : "No leído"}
                          color={row.read ? "success" : "warning"}
                        />
                      </TableCell>
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
                      No hay notificaciones pendientes.
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
