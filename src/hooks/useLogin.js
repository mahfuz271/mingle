import { useEffect, useState } from "react";

const useLogin = currentUser => {
    const [token, setToken] = useState('');
    useEffect(() => {
        if (currentUser.email) {
            fetch(`${process.env.REACT_APP_SERVER_URL}/jwtANDusers`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(currentUser)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.token) {
                        localStorage.setItem('accessToken', data.token);
                        localStorage.setItem('role', data.role);
                        setToken(data.token);
                    }
                });
        }
    }, [currentUser.email]);
    return [token];
}

export default useLogin;