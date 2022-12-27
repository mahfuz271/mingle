import React, { useContext } from 'react';
import { AuthContext } from '../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Logout = () => {
    const navigate = useNavigate();
    const { logOut, setLoading } = useContext(AuthContext);
    logOut().then(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        setLoading(false);
        navigate('/');
    }).catch(error => { toast(error.message); setLoading(false); });
};

export default Logout;