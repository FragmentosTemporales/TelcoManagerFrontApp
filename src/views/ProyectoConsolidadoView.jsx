import {
  Alert,
  Box,
  Button,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  getInfoProyecto
} from "../api/onnetAPI";

function ProyectoConsolidadoView() {
  const { id } = useParams();
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const orderedFields = [
    "Proyecto",
    "Nombre",
    "Region",
    "Agencia",
    "Comuna",
    "Direccion",
    "Central FTTx",
    "Target RTS",
    "Semana Proyectada RTS",
    "Semana Liberada",
    "Prioridad Planificación",
    "Semana Para Construir",
    "Semana Aprobación Construcción",
    "Estado Proyecto",
    "Estado ONFC",
    "Estado ONFI",
    "Estado Recursos",
    "Estado de Validacion Construccion",
    "Estado Calidad",
    "Estado Cruzada Logica",
    "Estado Cruzada Fisica",
    "Estado Permiso Privado",
    "Estado Visita",
    "Estado O&M",
    "Tipo",
    "Q Total CTO",
    "Semana Actual",
    "Rechazos Calidad",
    "diasBandeja",
    "uip",
    "fixed_uip",
    "Avance Empalmes",
    "Avance Lineas",
    "Informable SGS",
    "Proyectos Construidos",
    "Despliegue",
    "Origen",
    "NumeroVisitas",
    "Gestor Permiso",
    "Carta Entregada",
    "Motivo Avance Permiso Privado",
    "Carta Permiso Privado Firmada",
    "Fecha Carta Permiso Privado Firmada",
    "Fecha validacion Construccion",
    "Semana Validación Construcción",
    "Requiere Permisos",
    "Fecha Liberado a Ventas",
    "Orden Ingenieria",
    "Orden Construccion",
    "Fecha Permiso Obtenido",
    "Empresa Adjudicada",
    "Prioridad",
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getInfoProyecto(token, id);
      setData(response[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setOpen(true);
      setMessage("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const formatFecha = (key, value) => {
    if (key && key.startsWith("Fecha") && value) {
      // Try to parse and format as date, fallback to string
      const date = new Date(value);
      if (!isNaN(date)) {
        return date.toLocaleDateString();
      }
    }
    return value;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#f5f5f5",
        alignItems: "center",
        py: 2,
        minHeight: "90vh",
      }}
    >
      {open && (
        <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
          {message}
        </Alert>
      )}
      {isLoading ? (
        <Box
          sx={{
            width: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Skeleton
            variant="rounded"
            width={"100%"}
            height={"70%"}
            sx={{ p: 3, m: 3 }}
          />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              width: "90%",
              overflow: "hidden",
              mt: 3,
              mx: "auto",
            }}
          >
            <Link to="/proyectos-onnet">
              <Button
                variant="contained"
                sx={{
                  background: "#0b2f6d",
                  borderRadius: 2,
                  width: "200px",
                }}
              >
                <Typography>VOLVER</Typography>
              </Button>
            </Link>
          </Box>
          {data && (
            <Box sx={{ width: "90%", my: 4, backgroundColor: "#fff", borderRadius: 2, border: "2px solid #dfdeda" }}>
              <Box
                component="table"
                sx={{ width: "100%", borderCollapse: "collapse" }}
              >
                <Box component="thead">
                  <Box component="tr">
                    <Box
                      component="th"
                      sx={{
                        textAlign: "left",
                        borderBottom: 1,
                        p: 1,
                        bgcolor: "#0b2f6d",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      Ítem
                    </Box>
                    <Box
                      component="th"
                      sx={{
                        textAlign: "left",
                        borderBottom: 1,
                        p: 1,
                        bgcolor: "#0b2f6d",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      Valor
                    </Box>
                    <Box
                      component="th"
                      sx={{
                        textAlign: "left",
                        borderBottom: 1,
                        p: 1,
                        bgcolor: "#0b2f6d",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      Ítem
                    </Box>
                    <Box
                      component="th"
                      sx={{
                        textAlign: "left",
                        borderBottom: 1,
                        p: 1,
                        bgcolor: "#0b2f6d",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      Valor
                    </Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {(() => {
                    // 3. Use the ordered fields and map to data
                    const entries = orderedFields
                      .map((key) => [key, data[key]])
                      .filter(([key, _]) => key in data);
                    const rows = [];
                    for (let i = 0; i < entries.length; i += 2) {
                      const [key1, value1] = entries[i];
                      const pair2 = entries[i + 1];
                      const key2 = pair2 ? pair2[0] : "";
                      const value2 = pair2 ? pair2[1] : "";
                      rows.push(
                        <Box component="tr" key={key1}>
                          <Box
                            component="td"
                            sx={{
                              p: 1,
                              borderBottom: 1,
                              borderColor: "#eee",
                              bgcolor: "#f5f5f5",
                              fontWeight: "bold",
                            }}
                          >
                            {key1}
                          </Box>
                          <Box
                            component="td"
                            sx={{
                              p: 1,
                              borderBottom: 1,
                              borderColor: "#eee",
                            }}
                          >
                            {value1 === null || value1 === "" ? (
                              <em>Sin información</em>
                            ) : (
                              formatFecha(key1, value1).toString()
                            )}
                          </Box>
                          <Box
                            component="td"
                            sx={{
                              p: 1,
                              borderBottom: 1,
                              borderColor: "#eee",
                              bgcolor: "#f5f5f5",
                              fontWeight: "bold",
                            }}
                          >
                            {key2}
                          </Box>
                          <Box
                            component="td"
                            sx={{
                              p: 1,
                              borderBottom: 1,
                              borderColor: "#eee",
                            }}
                          >
                            {key2 === "" ? (
                              ""
                            ) : value2 === null || value2 === "" ? (
                              <em>Sin información</em>
                            ) : (
                              formatFecha(key2, value2).toString()
                            )}
                          </Box>
                        </Box>
                      );
                    }
                    return rows;
                  })()}
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default ProyectoConsolidadoView;
