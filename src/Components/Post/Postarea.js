import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Contexts/UserContext';
import { toast } from 'react-toastify';
import Comments from '../Modals/Comments';
import Createpost from '../Modals/Createpost';
import { Link } from 'react-router-dom';
const Postarea = ({ profile, createpost, sortby, limitpost }) => {

    const { logOut } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);

    const reloadPosts = () => {
        if (profile == 'all' || profile.email) {
            fetch(process.env.REACT_APP_SERVER_URL + `/postsByEmail?limit=${limitpost}&sort=${sortby}&email=${profile.email ? profile.email : 'all'}`, {
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
                .then(data => {
                    setPosts(data);
                })
        }
    }

    useEffect(reloadPosts, [profile?.email]);

    const loadComments = (id) => {
        document.querySelector("#commentModal .id").value = id;

        if (id) {
            fetch(process.env.REACT_APP_SERVER_URL + `/commentsByPID?id=${id}`, {
                method: 'POST',
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
                .then(data => {
                    setComments(data);
                })
        }
    }

    const postreact = (id, task = 'added') => {
        fetch(process.env.REACT_APP_SERVER_URL + `/postreact?task=${task}&id=${id}`, {
            method: 'POST',
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
                reloadPosts();
                toast(`like ${task}.`);
            })
    }

    return (
        <div className="mentions-section">
            {createpost && <Createpost profile={profile} reloadPosts={reloadPosts}></Createpost>}
            {posts.length > 0 ? posts.map((post) => {
                return <div className="post-item mb-20" key={post._id}>
                    <div className="post-content">
                        <div className="post-author">
                            <div className="post-author-inner">
                                <div className="author-thumb">
                                    <img src={post.user[0]?.photoURL} alt="img" width={60} />
                                </div>
                                <div className="author-details">
                                    <h6><Link to={`/profile?email=${post.email}`}>{post.user[0]?.name}</Link></h6>
                                    <ul className="post-status">
                                        <li className="post-privacy"><i className="icofont-world"></i> Public</li>
                                        <li className="post-time">{post?.created}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="post-description">
                            {post.text && <p>
                                {post.text}
                            </p>
                            }
                            {post.img && <div className="post-desc-img">
                                <div className="row g-3">
                                    <div className="col-md-8 mx-auto">
                                        <img src={post.img} alt="img" />
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                    <div className="post-meta">
                        <div className="post-meta-top">
                            <p><a><i className="icofont-like"></i> <span>{post?.like_count} like this</span></a>
                            </p>
                            <p data-bs-toggle="modal" data-bs-target="#commentModal" onClick={() => loadComments(post._id)}>
                                <a>{post?.comment_count} Comments</a>
                            </p>
                        </div>
                        <div className="post-meta-bottom">
                            <ul className="react-list">
                                <li className="react">
                                    {post?.like_by != false ? <a className='active-like' onClick={() => postreact(post._id, "removed")}>
                                        <i className="icofont-like"></i>
                                        Like
                                    </a> : <a onClick={() => postreact(post._id)}>
                                        <i className="icofont-like"></i>
                                        Like
                                    </a>}
                                </li>
                                <li className="react" data-bs-toggle="modal" data-bs-target="#commentModal" onClick={() => loadComments(post._id)}>
                                    <a><i className="icofont-speech-comments"></i>
                                        Comment
                                    </a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            }) : <div className="info-card mb-20"><div className="info-card-title"><p className='col-md-12 mb-5 mt-5 text-center'>No Post Found.</p></div></div>}
            <div className="load-btn d-none">
                <a href="#" className="lab-btn">Load More Post <i className="icofont-spinner"></i></a>
            </div>
            <Comments comments={comments} loadComments={loadComments}></Comments>
        </div>
    );
};

export default Postarea;