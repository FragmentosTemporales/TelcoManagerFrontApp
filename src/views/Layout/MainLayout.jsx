import { Box } from "@mui/material";
import Navbar from "../../components/navbar";
import { palette } from "../../theme/palette";

function MainLayout({ children, showNavbar = true }) {
    return (
        <>
            {showNavbar && <Navbar />}
            <Box
                sx={{
                    pt: showNavbar ? '64px' : 0, // offset navbar height
                    minHeight: '95vh',
                    background: palette ? palette.bgGradient : '#142a3d',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                }}
            >
                {children}
            </Box>
        </>
    );
}

export default MainLayout;
