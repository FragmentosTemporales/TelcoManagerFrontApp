import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  InputLabel,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import {
  getSolicitudeStats,
  getSolicitudeCCStats,
  getSolicitudeTOPStats,
  getSolicitudePendientes,
} from "../api/solicitudAPI";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function SolicitudCharts() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [dataCC, setDataCC] = useState(undefined);
  const [dataTop, setDataTop] = useState(undefined);
  const [dataPendientes, setDataPendientes] = useState(undefined);

  const fetchChartData = async () => {
    setIsLoading(true);
    try {
      const response = await getSolicitudeStats(token);
      const sortedData = response.sort((a, b) => b.Q - a.Q);
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const fetchChartDataCC = async () => {
    setIsLoading(true);
    try {
      const response = await getSolicitudeCCStats(token);
      setDataCC(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const fetchChartDataPendientes = async () => {
    setIsLoading(true);
    try {
      const response = await getSolicitudePendientes(token);
      console.log("Data Pendientes:", response);
      setDataPendientes(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const fetchChartDataTOP = async () => {
    setIsLoading(true);
    try {
      const response = await getSolicitudeTOPStats(token);
      setDataTop(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

    const extractDate = (gmtString) => {
    const date = new Date(gmtString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const setTableHeadPendientes = () => (
    <>
      <TableHead>
        <TableRow>
          {["FOLIO","MOTIVO","SOLICITANTE","AMONESTADO","RUT","ESTADO","CAMBIO ESTADO","DIAS"].map((header, index) => (
            <TableCell
              key={header}
              align="center"
              sx={{
                background: "#0b2f6d",
                fontWeight: "bold",
                fontSize: "10px",
                color: "#ffffff",
                borderRadius:
                  index === 0 ? "20px 0 0 0" : index === 7 ? "0 20px 0 0" : "0",
              }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </>
  );

  const setTableHead = () => (
    <>
      <TableHead>
        <TableRow>
          {["CANTIDAD", "NOMBRE", "CENTRO COSTO"].map((header, index) => (
            <TableCell
              key={header}
              align="center"
              sx={{
                background: "#0b2f6d",
                fontWeight: "bold",
                fontSize: "10px",
                color: "#ffffff",
                borderRadius:
                  index === 0 ? "20px 0 0 0" : index === 2 ? "0 20px 0 0" : "0",
              }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </>
  );

  const setTableBody = () => (
    <>
      <TableBody
        sx={{
          display: "column",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        {dataTop && dataTop.length > 0 ? (
          dataTop.map((row, index) => (
            <TableRow key={index}>
              <TableCell
                align="center"
                sx={{ fontSize: "10px", width: "10%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.Q ? row.Q : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "10px", width: "45%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.Nombre ? row.Nombre : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "10px", width: "45%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.CENTRO_COSTO ? row.CENTRO_COSTO : "Sin Información"}
                </Typography>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} align="center" sx={{ width: "100%" }}>
              No hay datos disponibles
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );

  const setTableBodyPendientes = () => (
    <>
      <TableBody
        sx={{
          display: "column",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        {dataPendientes && dataPendientes.length > 0 ? (
          dataPendientes.map((row, index) => (
            <TableRow key={index}>
              <TableCell
                align="center"
                sx={{ fontSize: "10px"}} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.Folio ? row.Folio : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "10px"}} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.Motivo ? row.Motivo : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "10px"}} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.Solicitante ? row.Solicitante : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "10px"}} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.Amonestado ? row.Amonestado : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "10px"}} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.RUT ? row.RUT : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "10px"}} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.Estado ? row.Estado : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "10px"}} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row["Cambio Estado"] ? extractDate(row["Cambio Estado"]) : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontSize: "10px"}} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.Dias ? row.Dias : "Sin Información"}
                </Typography>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} align="center" sx={{ width: "100%" }}>
              No hay datos disponibles
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );

  useEffect(() => {
    fetchChartDataCC();
  }, []);

  useEffect(() => {
    fetchChartData();
  }, []);

  useEffect(() => {
    fetchChartDataTOP();
  }, []);

  useEffect(() => {
    fetchChartDataPendientes();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        Histórico de Solicitudes
      </Typography>
      {isLoading ? (
        <Box
          sx={{
            width: "90%",
            marginTop: 2,
            padding: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 400,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            width: "90%",
            padding: 2,
          }}
        >
          {/** PRIMER GRAFICO POR ESTADOS **/}
          <Box
            sx={{
              width: { xs: "100%", lg: "100%" },
              marginBottom: { xs: 2, lg: 0 },
              padding: 2,
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} layout="horizontal">
                <defs>
                  <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#124fb9 " stopOpacity={1} />
                    <stop offset="100%" stopColor="#0d3984" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis dataKey="Estado" fontSize={10} />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: "20px",
                    border: "1px solid #ccc",
                  }}
                />
                <Bar dataKey="Q" fill="url(#barGradient1)">
                  <LabelList
                    dataKey="Q"
                    position="inside"
                    fill="#ffffff"
                    fontWeight={"bold"}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
          {/** SEGUNDO GRAFICO Y TABLA CON TOPS**/}
          <Box
            sx={{
              width: { xs: "100%", lg: "100%" },
              marginBottom: { xs: 2, lg: 0 },
              display: "flex",
              flexDirection: "row",
              height: "300px",
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", lg: "100%" },
                marginBottom: { xs: 2, lg: 0 },
                display: "flex",
                flexDirection: "column",
                height: "300px",
              }}
            >
              {/** SEGUNDO GRAFICO POR CENTRO DE COSTO **/}
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Histórico por Centro de Costo
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  marginBottom: { xs: 2, lg: 0 },
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataCC} layout="horizontal">
                    <defs>
                      <linearGradient
                        id="barGradient2"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#ff3333" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#b22323"
                          stopOpacity={1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" />
                    <XAxis dataKey="CENTRO_COSTO" fontSize={10} />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#f5f5f5",
                        borderRadius: "20px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <Bar dataKey="Q" fill="url(#barGradient2)">
                      <LabelList
                        dataKey="Q"
                        position="inside"
                        fill="#ffffff"
                        fontWeight={"bold"}
                        fontSize={10}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>

            <Box
              sx={{
                width: { xs: "100%", lg: "100%" },
                marginBottom: { xs: 2, lg: 0 },
                display: "flex",
                flexDirection: "column",
                height: "300px",
              }}
            >
              {/** SEGUNDO GRAFICO POR CENTRO DE COSTO **/}
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Top 10 Trabajadores activos amonestados
              </Typography>
              {/** TABLA CON TOPS **/}
              <Box
                sx={{
                  width: "100%",
                  marginBottom: { xs: 2, lg: 0 },
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <TableContainer
                  sx={{
                    maxHeight: 300, // Set a max height for scrolling
                    borderRadius: "20px",
                  }}
                >
                  <Table
                    sx={{
                      width: "100%",
                      display: "column",
                      justifyContent: "center",
                    }}
                    stickyHeader
                  >
                    {setTableHead()}
                    {setTableBody()}
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Box>

          {/** TABLA CON SOLICITUDES PENDIENTES **/}
          <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingTop: 4,
          }}
        >
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Solicitudes con gestión mayor a 10 días
            </Typography>
            <TableContainer
              sx={{
                maxHeight: 300, // Set a max height for scrolling
                borderRadius: "20px",
              }}
            >
              <Table
                sx={{
                  width: "100%",
                  display: "column",
                  justifyContent: "center",
                }}
                stickyHeader
              >
                {setTableHeadPendientes()}
                {setTableBodyPendientes()}
              </Table>
            </TableContainer>
          </Box>

        </Box>
      )}
    </Box>
  );
}

export default SolicitudCharts;
