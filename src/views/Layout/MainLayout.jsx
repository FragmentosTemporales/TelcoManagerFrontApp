import { Box} from "@mui/material";

import Navbar from "../../components/navbar";

function MainLayout({ children, showNavbar = true }) {

    return (
        <>
            {showNavbar && (
                <Navbar />
            )}
            <Box>
                {children}
            </Box>
        </>
    );
}

export default MainLayout;
