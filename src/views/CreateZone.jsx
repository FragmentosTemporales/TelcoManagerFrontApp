import { Box } from "@mui/material";
import PermisosList from "../components/permisosForm";
import UserForm from "../components/userForm";

function CreateZone() {
  return (
    <Box
      sx={{
        height: "100%",
        marginTop: "60px",
      }}
    >
      <UserForm />
      <PermisosList />
    </Box>
  );
}

export default CreateZone;
