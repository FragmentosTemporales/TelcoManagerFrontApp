import { Box } from "@mui/material";
import PermisosList from "../components/permisosForm";

function CreateZone() {
  return (
    <Box
      sx={{
        height: "100%",
        marginTop: "60px",
      }}
    >
      <PermisosList />
    </Box>
  );
}

export default CreateZone;
