import { Box } from "@mui/material";
import UserForm from "../components/userForm";
import UserList from "../components/userList";
import PermisosList from "../components/permisosForm";

function CreateZone() {
  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      <UserForm />
      <PermisosList/>
      {/*<UserList/>*/}
    </Box>
  );
}

export default CreateZone;
