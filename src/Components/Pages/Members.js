import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/UserContext';
import useDocumentTitle from '../../Layout/useDocumentTitle';

const Members = () => {
    useDocumentTitle("All Media");

    const { logOut } = useContext(AuthContext);
    const [users, setUsers] = useState([])

    const reloadUsers = () => {
        fetch(process.env.REACT_APP_SERVER_URL + `/users?role=user`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    return logOut();
                }
                return res.json();
            })
            .then(res => {
                setUsers(res);
            });
    }

    useEffect(reloadUsers, []);

    return (
        <div className='container pt-5'>
            <h3 className='text-light'>All Members</h3>
            <div className="row">
                <div className="col-xl-12">
                    <article>
                        <div className="row gy-4 gx-3 justify-content-center">
                            {users.length > 0 ? users.map((u) => {
                                return <Link to={`/profile?email=` + u.email} key={u._id} className="col-lg-3 col-md-4 col-6">
                                    <div className="lab-item member-item style-1">
                                        <div className="lab-inner">
                                            <div className="lab-thumb">
                                                <img src={u.photoURL} alt="member-img" />
                                            </div>
                                            <div className="lab-content">
                                                <h6>{u.name}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            }) : <div className="info-card mb-20"><div className="info-card-title"><p className='col-md-12 mb-5 mt-5 text-center'>No Members Found.</p></div></div>}

                        </div>
                    </article>
                </div>
            </div>
        </div>

    );
};

export default Members;