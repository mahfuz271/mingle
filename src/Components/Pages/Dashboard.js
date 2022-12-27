import React, { useContext } from 'react';
import { AuthContext } from '../../Contexts/UserContext';


const Dashboard = () => {
    const { user } = useContext(AuthContext);
    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome back <strong>{user.displayName}!</strong></p>
        </div>
    );
};

export default Dashboard;