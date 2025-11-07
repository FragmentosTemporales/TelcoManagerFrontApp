import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from "react-redux";

const PrivateRoutes = () => {

    const authState = useSelector((state) => state.auth);
    const { token } = authState;

    let auth = { 'token': token !== null };
    return (
       auth.token ? <Outlet/> : <Navigate to="/loginPage" />
    )
}
export default PrivateRoutes;