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
      <Box sx={{ width: '65%', mb: 3 }}>
        <Link to="/modulo:solicitudes">
          <Button variant="contained" sx={{
            width: "200px",
            background: `linear-gradient(135deg, ${palette.accent} 0%, #43baf5 50%, ${palette.accent} 100%)`,
            color: '#fff',
            transition: 'all .35s',
            '&:before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(160deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%)',
              mixBlendMode: 'overlay',
              pointerEvents: 'none'
            },
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 14px 28px -6px rgba(0,0,0,0.55), 0 4px 12px -2px rgba(0,0,0,0.45)',
              background: `linear-gradient(135deg, #43baf5 0%, ${palette.accent} 55%, #1d88c0 100%)`
            },
            '&:active': { transform: 'translateY(-1px)', boxShadow: '0 8px 18px -6px rgba(0,0,0,0.55)' },
            '&:focus-visible': { outline: '2px solid #ffffff', outlineOffset: 2 }
          }}>
            <Typography sx={{ color: 'white' }}>Volver</Typography>
          </Button>
        </Link>
      </Box>
      <FormSolicitud />
    </Box>
  );
}

export default CreateArea;
