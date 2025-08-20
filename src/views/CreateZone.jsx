import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import UserForm from "../components/userForm";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import { useEffect } from "react";

function CreateZone() {

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <MainLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          py: 8,
          background: palette.bgGradient,
          position: 'relative',
          px: { xs: 2, md: 4 },
          '::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 82% 72%, rgba(255,255,255,0.07), transparent 65%)',
            pointerEvents: 'none'
          }
        }}
      >
        <UserForm />
      </Box>
    </MainLayout>
  );
}

export default CreateZone;
