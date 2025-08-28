import { Box, Typography, Divider } from '@mui/material';


export function ModuleHeader({ title, subtitle, maxWidth = 840, align = 'center', divider = true }) {
  const isCenter = align === 'center';
  return (
    <Box sx={{
      mb: 3,
      color: '#fff',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <Box sx={{ width: '100%', maxWidth, mx: 'auto', textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            letterSpacing: 0.8,
            textShadow: '0 2px 4px rgba(0,0,0,.4)',
            lineHeight: 1.2,
            textAlign: 'center'
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.65, maxWidth: 720, mx: 'auto', textAlign: 'center' }}>
            {subtitle}
          </Typography>
        )}
        {divider && (
          <Divider
            sx={{
              mt: 1.5,
              borderColor: 'rgba(255,255,255,0.18)',
              width: isCenter ? '60%' : '40%',
              maxWidth: 420,
              mx: 'auto'
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default ModuleHeader;
