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

    </Box>
  );
}

export default NotificacionesView;
