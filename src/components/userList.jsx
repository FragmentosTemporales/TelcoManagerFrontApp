import {
  Box,
  Card,
  CircularProgress,
  CardContent,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import DoNotDisturbOutlinedIcon from "@mui/icons-material/DoNotDisturbOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../api/authAPI";
import { onLoad, onLoading } from "../slices/userSlice";

function UserList() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const userState = useSelector((state) => state.user);
  const { data, is_loading } = userState;
  const { token } = authState;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      dispatch(onLoading());
      const res = await getUsers(token);
      dispatch(onLoad(res));
    } catch (error) {
      console.log(error);
    }
  };

  const renderAccessChip = (access) => {
    const Icon = access ? CheckCircleOutlineOutlinedIcon : DoNotDisturbOutlinedIcon;
    const color = access ? "warning" : "error";

    return (
      <Chip
        label={
          <Icon
            sx={{
              width: "24px", 
              height: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        }
        color={color}
      />
    );
  };

  const renderTableHeaders = () => (
    <TableHead>
      <TableRow>
        {["ID", "RUT", "NOMBRE", "REPORTES", "REVERSA", "AMONESTACIONES", "CREACION"].map((header) => (
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
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell align="center" sx={{ fontSize: "12px" }}>{item.userID}</TableCell>
              <TableCell align="center" sx={{ fontSize: "12px" }}>{item.numDoc}</TableCell>
              <TableCell align="center" sx={{ fontSize: "12px" }}>{item.nombre}</TableCell>
              {[1, 2, 3, 4].map((moduloID) => {
                const permiso = item.permisos.find((permiso) => permiso.moduloID === moduloID);
                return (
                  <TableCell key={moduloID} align="center" sx={{ fontSize: "12px", width:"150px" }}>
                    {renderAccessChip(permiso ? permiso.access : "N/A")}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
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
    if (is_loading) {
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
      <CardContent sx={{ width: { lg: "80%", md: "90%", xs: "95%" } }}>
        <Card>
          <CardHeader
            title="LISTA DE USUARIOS"
            sx={{
              backgroundColor: "#0b2f6d",
              color: "white",
              padding: "10px",
              borderBottom: "1px solid #ddd",
              fontWeight: "bold",
              textAlign: "center",
            }}
          />
          <TableContainer component={Paper} sx={{ width: "100%", height: "100%", overflow: "auto" }}>
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
        justifyContent: "center",
        alignItems: "center",
        paddingTop: { xs: 10, md: 8 },
        mt: 2,
      }}
    >
      {renderTable()}
    </Box>
  );
}

export default UserList;
