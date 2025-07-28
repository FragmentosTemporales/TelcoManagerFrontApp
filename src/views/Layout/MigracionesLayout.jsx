import { Box, Divider, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Navbar from "../../components/navbar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
    getDataMigracionesPendientes,
    getMigracionGestiones,
    getQMigracionesPendientesdeVista
} from "../../api/despachoAPI";
import extractDate from "../../helpers/main";
import { onLoad } from "../../slices/migracionSlice";

function MigracionLayout({ children, showNavbar = true, id_vivienda = null }) {

    const authState = useSelector((state) => state.auth);
    const { token } = authState;

    const migracionState = useSelector((state) => state.migraciones);
    const { id_selected } = migracionState;

    const [QMigracionesPendientesVista, setQMigracionesPendientesVista] = useState([]);
    const [dataGestiones, setDataGestiones] = useState([]);
    const [dataPendiente, setDataPendiente] = useState([]);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const dispatch = useDispatch();
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const handleSubmitPendiente = (e, id_vivienda) => {
        e.preventDefault();
        try {
            dispatch(onLoad({ id_selected: id_vivienda }));
        } catch (error) {
            console.error("Error al seleccionar la migración:", error);
        }
    };

    const fetchPendientesVista = async () => {
        try {
            console.log("Fetching pending migrations for view");
            const response = await getQMigracionesPendientesdeVista(token);
            setQMigracionesPendientesVista(response);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchGestiones = async () => {
        setDataGestiones([]);
        try {
            const response = await getMigracionGestiones(id_vivienda, token);
            setDataGestiones(response);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPendientes = async () => {
        try {
            const response = await getDataMigracionesPendientes(token);
            setDataPendiente(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchPendientesVista();
    }, [id_selected]);

    useEffect(() => {
        fetchPendientes();
    }, [id_vivienda]);

    useEffect(() => {
        if (id_vivienda) {
            fetchGestiones();
        }
    }, [id_vivienda, token]);

    return (
        <>
            {showNavbar && (
                <Navbar />
            )}
            {QMigracionesPendientesVista && QMigracionesPendientesVista.length > 0 && (
                <Box
                    sx={{
                        width: "100%",
                        backgroundColor: "#0b2f6d",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        paddingTop: "60px"

                    }}
                >


                    <Box
                        component="marquee"
                        behavior="scroll"
                        direction="left"
                        scrollamount="5"
                        sx={{
                            flexGrow: 1,
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {QMigracionesPendientesVista.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    marginRight: 4,
                                }}
                            >
                                <Typography fontFamily="monospace" sx={{ color: "yellow" }}>
                                    {item.COMUNA}: {item.Q}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
            {/* Toggle button for sidebar */}
            <Box
                sx={{
                    position: "fixed",
                    left: sidebarVisible ? "20%" : "0",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1000,
                    transition: "left 0.3s ease-in-out",
                }}
            >
                <IconButton
                    onClick={toggleSidebar}
                    sx={{
                        backgroundColor: "#0b2f6d",
                        color: "white",
                        "&:hover": {
                            backgroundColor: "#1a3f7d",
                        },
                        borderRadius: "0 8px 8px 0",
                        padding: "12px 8px",
                    }}
                >
                    {sidebarVisible ? <ChevronLeft /> : <ChevronRight />}
                </IconButton>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", minHeight: "90vh", paddingTop: QMigracionesPendientesVista.length > 0 ? "0px" : "60px" }}>
                {sidebarVisible && (
                    <Box
                        sx={{
                            width: "20%",
                            minWidth: "200px",
                            backgroundColor: "#0b2f6d",
                            transition: "width 0.3s ease-in-out",
                        }}
                    >
                        {dataPendiente && dataPendiente.length > 0 ? (
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {dataPendiente.map((item, index) => (
                                    <Box
                                        key={index}
                                        onClick={(e) => handleSubmitPendiente(e, item.id_vivienda)}
                                        sx={{
                                            backgroundColor: "#fff",
                                            mb: 1,
                                            width: "98%",
                                            cursor: "pointer",
                                            borderRadius: 2,
                                            paddingTop: 1,
                                            paddingBottom: 1,
                                            transition:
                                                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                textAlign: "left",
                                                color: "#0b2f6d",
                                                fontWeight: "bold",
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                            }}
                                        >
                                            {" "}
                                            MIGRACION PENDIENTE
                                        </Typography>
                                        <Typography
                                            key={index}
                                            variant="body1"
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                            }}
                                        >
                                            {" "}
                                            {item.Cliente}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#666",
                                                fontSize: "11px",
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                            }}
                                        >
                                            {" "}
                                            {item.Celular}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#666",
                                                fontSize: "11px",
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                            }}
                                        >
                                            {" "}
                                            {item.COMUNA}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#666",
                                                fontSize: "11px",
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                            }}
                                        >
                                            {item.bloque_horario}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#666",
                                                fontSize: "11px",
                                                fontStyle: "italic",
                                                fontWeight: "bold",
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                            }}
                                        >
                                            {" "}
                                            {item.comentario ? (
                                                <>{item.comentario}</>
                                            ) : (
                                                "Sin Comentario"
                                            )}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        ) : null}
                        <Divider sx={{ width: "98%", marginY: 2, borderColor: "#ffffff" }} />
                        {dataGestiones && dataGestiones.length > 0 ? (
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 2,
                                }}
                            >
                                {dataGestiones.map((item, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            backgroundColor: "#fff",
                                            width: "98%",
                                            borderRadius: 2,
                                            paddingTop: 1,
                                            paddingBottom: 1,
                                            mb: 1
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                textAlign: "left",
                                                color: "#0b2f6d",
                                                fontWeight: "bold",
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                            }}
                                        >
                                            GESTION PREVIA
                                        </Typography>
                                        <Typography
                                            key={index}
                                            variant="body1"
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                            }}
                                        >
                                            {" "}
                                            {item.contacto}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#666",
                                                fontSize: "11px",
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                            }}
                                        >
                                            {" "}
                                            {item.ingreso}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#666",
                                                fontSize: "11px",
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                            }}
                                        >
                                            {" "}
                                            {extractDate(item.fecha_registro)}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#666",
                                                fontSize: "11px",
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                            }}
                                        >
                                            {item.bloque_horario}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#666",
                                                fontSize: "11px",
                                                fontStyle: "italic",
                                                fontWeight: "bold",
                                                paddingLeft: 2,
                                                paddingRight: 2,
                                            }}
                                        >
                                            {" "}
                                            {item.comentario ? (
                                                <>{item.comentario}</>
                                            ) : (
                                                "Sin Comentario"
                                            )}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        ) : null}
                    </Box>
                )}
                <Box
                    sx={{
                        width: sidebarVisible ? "80%" : "100%",
                        transition: "width 0.3s ease-in-out"
                    }}
                >
                    {children}
                </Box>
            </Box>
        </>
    );
}

export default MigracionLayout;