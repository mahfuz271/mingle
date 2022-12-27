import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/UserContext';
import useRole from '../hooks/useRole';

const RoleRoute = ({ children, for_role }) => {
    const { user, loading } = useContext(AuthContext);
    const [role, isRoleLoading] = useRole(user?.email);

    if (loading || isRoleLoading) {
        return <div className='text-center my-5'><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
    }

    if (user && role==for_role) {
        return children;
    }

    return <Navigate to="/" replace></Navigate>;
};

export default RoleRoute;