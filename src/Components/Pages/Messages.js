import userEvent from '@testing-library/user-event';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/UserContext';
import useDocumentTitle from '../../Layout/useDocumentTitle';

const Messages = () => {
    useDocumentTitle("Messages");

    const { logOut, user } = useContext(AuthContext);
    const [messages, setMessages] = useState([])

    const reloadMessages = () => {
        fetch(process.env.REACT_APP_SERVER_URL + `/allMessages`, {
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
                setMessages(res);
            });
    }

    useEffect(reloadMessages, []);

    return (
        <div className='container pt-5'>
            <h3 className='text-light'>All Mesaages</h3>
            <div className="row">
                <div className="col-xl-12">
                    <article>
                        <div className="row gy-4 gx-3 justify-content-center">
                            {messages.length > 0 ? messages.filter((u) => { return u.email != user.email }).map((u) => {
                                return <Link to={`/message?email=` + u.email} key={u._id} class="list-group-item list-group-item-action border-0">
                                    <div class="d-flex align-items-center">
                                        <img src={u.photoURL} class="rounded-circle mr-1" width="40" height="40" />
                                        <div class="flex-grow-1 ml-3">
                                            {u.name}
                                        </div>
                                    </div>
                                </Link>
                            }) : <div className="info-card mb-20"><div className="info-card-title"><p className='col-md-12 mb-5 mt-5 text-center'>No Chat Found.</p></div></div>}

                        </div>
                    </article>
                </div>
            </div>
        </div>

    );
};

export default Messages;