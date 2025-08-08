import { AppBar, Box, Button, Toolbar, Tooltip, Typography } from "@mui/material";

import { Link } from "react-router-dom";
import Navbar from "../../components/navbar";


function NdcLayout({ children, showNavbar = true }) {

    return (
        <>
            {showNavbar && (
                <Navbar />
            )}
            <Box sx={{ background: "#0b2f6d", height: "60px", marginTop: "70px" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-evenly", alignContent: "center" }}>
                    <Link to="/modulo:ndc/pendientes-sin-consumo" style={{
                        color: "white",
                        textDecoration: "none",
                    }}>
                        <Button variant="contained" sx={{ width: "200px", borderRadius: 2, background: "#124fb9", }}>
                            PENDIENTES S/C
                        </Button>
                    </Link>
                    <Link to="/modulo:ndc/error-con-consumo" style={{
                        color: "white",
                        textDecoration: "none",
                    }}>
                        <Button variant="contained" sx={{ width: "200px", borderRadius: 2, background: "#124fb9", }}>
                            ERROR C/C
                        </Button>
                    </Link>
                    <Link to="/modulo:ndc/logs-errors" style={{
                        color: "white",
                        textDecoration: "none",
                    }}>
                        <Button variant="contained" sx={{ width: "200px", borderRadius: 2, background: "#124fb9", }}>
                            ORDENES C/ ERROR
                        </Button>
                    </Link>
                </Toolbar>
            </Box>
            <Box>
                {children}
            </Box>
        </>
    );
}

export default NdcLayout;
