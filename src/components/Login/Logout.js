import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Logout({handler}) {
    const [user, setUser] = handler
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    removeCookie('user')
    setUser(null)
    return (
        <Navigate to='/' />
    )
}

export default Logout