import { useEffect, useState } from "react"

const useRole = email => {
    const [role, setRole] = useState(false);
    const [isRoleLoading, setRoleLoading] = useState(true);
    useEffect(() => {
        if (email) {
            fetch(`${process.env.REACT_APP_SERVER_URL}/getRole`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem('role', data.role);
                    setRole(data.role);
                    setRoleLoading(false);
                })
        }
    }, [email])
    return [role, isRoleLoading]
}

export default useRole;