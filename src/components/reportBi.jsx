import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";
import "../styles/reports.css";

import { createPB_Token } from "../api/powerBIAPI";

function ReportesPowerBiTelco({reportId, groupId, url, name}) {
  const [token, setToken] = useState(undefined);

  const fetchToken = async () => {
    const res = await createPB_Token(groupId, reportId);
    setToken(res.token);
  };

  useEffect(() => {
    fetchToken();
  }, []);

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
      <h1>{name}</h1>
      {token ? (
        <PowerBIEmbed
          embedConfig={{
            type: "report",
            id: reportId,
            embedUrl: url,
            accessToken:token,
            tokenType: models.TokenType.Embed,
            settings: {
              panes: {
                filters: {
                  expanded: false,
                  visible: false,
                },
              },
              background: models.BackgroundType.Transparent,
              navContentPaneEnabled: false,
            },
          }}
          eventHandlers={
            new Map([
              ["loaded", () => console.log("Report loaded")],
              ["rendered", () => console.log("Report rendered")],
              ["error", (event) => console.log(event.detail)],
              ["visualClicked", () => console.log("Visual clicked")],
              ["pageChanged", (event) => console.log(event)],
            ])
          }
          cssClassName={"reportClass"}
          getEmbeddedComponent={(embeddedReport) => {
            window.Report = embeddedReport;
            console.log("Report embedded", embeddedReport);
          }}
        />
      ) : (
        <h1>CARGANDO DF</h1>
      )}
    </Box>
  );
}

export default ReportesPowerBiTelco;
