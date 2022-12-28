import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../Contexts/UserContext';
import useDocumentTitle from '../../Layout/useDocumentTitle';
import { toast } from 'react-toastify';

const Message = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    const [email, setEmail] = useState(null);
    let location = useLocation()
    useDocumentTitle("Message");
    const { logOut, user } = useContext(AuthContext);
    const [messeges, setMessages] = useState([])

    const reloadMessages = () => {
        if (email) {
            fetch(process.env.REACT_APP_SERVER_URL + `/messages?email=${email}`, {
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
    }

    useEffect(() => {
        if (searchParams.get("email")) {
            setEmail(searchParams.get("email"));
        } else {
            setEmail(null);
        }
    }, [location])

    useEffect(reloadMessages, [email]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const text = form.text.value;

        let data = { text, to: email };

        fetch(process.env.REACT_APP_SERVER_URL + `/addMessage`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    return logOut();
                }
                return res.json();
            })
            .then(data => {
                toast('Sent');
                form.reset();
                reloadMessages();
            })

    }
    const left = 'chat-message-left mb-4';
    const right = 'chat-message-right mb-4';
    return (
        <div className='container pt-5'>
            <div class="card mb-5">
                <div class="row g-0">
                    <div class="col-12">
                        <div class="py-2 px-4 border-bottom d-none d-lg-block">
                            {messeges && messeges.user && <div class="d-flex align-items-center py-1">
                                <div class="position-relative">
                                    <img src={messeges.user.photoURL} class="rounded-circle mr-1" alt="" width="40" height="40" />
                                </div>
                                <Link to={`/profile?email=${messeges.user.email}`} class="flex-grow-1 pl-3"> &nbsp; &nbsp;<strong> {messeges.user.name}</strong>
                                    <div class="text-muted small"><em></em></div>
                                </Link>
                                <div>
                                    <button class="btn btn-light border btn-lg px-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal feather-lg"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></button>
                                </div>
                            </div>}
                        </div>

                        <div class="position-relative">
                            <div class="chat-messages p-4">
                                {messeges && messeges.messages && messeges.messages.length > 0 ? messeges.messages.map((m) => {
                                    return <div key={m._id} class={m.email == user.email ? right : left}>
                                        <div>
                                            <img src={m.email == user.email ? user.photoURL : messeges.user.photoURL} class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40" />
                                            <div class="text-muted small text-nowrap mt-2 text-center" title={m.created}><i class="icofont-ui-clock"></i></div>
                                        </div>
                                        <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                            <div class="font-weight-bold mb-1">{m.email == user.email ? "You" : messeges.user.name}</div>
                                            {m.text}
                                        </div>
                                    </div>
                                }) : ''}

                            </div>
                        </div>

                        <form onSubmit={handleSubmit} class="flex-grow-0 py-3 px-4 border-top">
                            <div class="input-group">
                                <input type="text" name='text' class="form-control" placeholder="Type your message" />
                                <button class="btn btn-primary">Send</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;