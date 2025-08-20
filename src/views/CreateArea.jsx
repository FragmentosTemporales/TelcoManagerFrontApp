import { Box, Button, Alert, Typography } from "@mui/material";
import FormSolicitud from "../components/formSolicitud";
import { Link } from "react-router-dom";
import { palette } from "../theme/palette";

function CreateArea({ open, handleClose, message }) {
  const renderAlert = () => (
    <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
      {message}
    </Alert>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '90vh',
        py: 8,
        background: palette.bgGradient,
        position: 'relative',
        '::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 25% 20%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06), transparent 65%)',
          pointerEvents: 'none'
        }
      }}
    >
      {open && renderAlert()}
      <Box sx={{ width: '55%', mb: 3 }}>
        <Link to="/modulo:solicitudes">
          <Button variant="contained" sx={{ background: `linear-gradient(130deg, ${palette.accent} 0%, ${palette.primaryDark} 85%)`, borderRadius: 2, width: 200, fontWeight: 600, letterSpacing: .4, boxShadow: '0 4px 14px -6px rgba(0,0,0,0.55)', '&:hover': { background: `linear-gradient(130deg, ${palette.accent} 0%, ${palette.primary} 90%)` } }}>
            <Typography sx={{ color: 'white' }}>Volver</Typography>
          </Button>
        </Link>
      </Box>
      <FormSolicitud />
    </Box>
  );
}

export default CreateArea;
