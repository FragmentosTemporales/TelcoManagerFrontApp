import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";

import { createAccessToken } from "../api/powerBIAPI";
import { ConstructionOutlined } from "@mui/icons-material";

function ReportesPowerBiTelco() {

  const clientID = "a22bf932-de75-4ae1-b234-14924de94485";
  const secretID = "72d39cb8-73e6-4852-ad6a-27171283ff66";

  const resource = "https://analysis.windows.net/powerbi/api";


  const data = {
    grant_type: "client_credentials",
    client_id: clientID,
    client_secret: secretID,
    resource: resource,
  };

  const fetchToken = async () => {
    try {
      console.log("# INICIANDO CONSULTA #")
      const response = await createAccessToken(url, data);
      console.log(response);
    } catch (error) {
      console.log("# LA CONSULTA HA FALLADO #")
      console.log(error);
    }
    console.log("# CONSULTA FINALIZADA #")
  };

  useEffect(()=>{
    fetchToken()
  },[])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
        paddingTop: 1,
      }}
    >

    </Box>
  );
}

export default ReportesPowerBiTelco;
