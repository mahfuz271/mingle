import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Contexts/UserContext';
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';
import Comments from '../Modals/Comments';
const Postarea = ({ profile }) => {
    const imgHostKey = process.env.REACT_APP_imgbb_key;

    const { modal_close, logOut, user } = useContext(AuthContext);

    const [posts, setPosts] = useState([])

    const reloadPosts = () => {
        if (profile.email) {
            fetch(process.env.REACT_APP_SERVER_URL + `/postsByEmail?email=${profile?.email}`, {
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

    const saveDetailsToServer = (post, form) => {
        fetch(process.env.REACT_APP_SERVER_URL + `/post`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(post)
        })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    return logOut();
                }
                return res.json();
            })
            .then(data => {
                toast('successfully posted');
                form.reset();
                fileChangedTrigger();
                reloadPosts();
            })
    }

    const fileChangedTrigger = event => {
        const txt = event?.target?.value?.replace(/^.*(\\|\/|\:)/, '');
        document.querySelector(".image-video .file-btn span").textContent = (txt && txt != '') ? txt : 'Photo';
    }

    const handleSubmit = event => {
        event.preventDefault();
        const form = event.target;
        let data = new FormData(form);
        data.append('email', user.email);
        let post = Object.fromEntries(data);

        if (post.imagefile?.name) {
            let formdata = new FormData();
            formdata.append('image', post.imagefile);
            delete post.imagefile;
            fetch(`https://api.imgbb.com/1/upload?key=${imgHostKey}`, {
                method: 'POST',
                body: formdata
            })
                .then(res => {
                    return res.json();
                })
                .then(imgdata => {
                    if (imgdata.success) {
                        post.img = imgdata.data.url;
                        saveDetailsToServer(post, form);
                    }
                })
        } else {
            delete post.imagefile;
            saveDetailsToServer(post, form);
        }
    }

    const [comments, setComments] = useState([])

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

        <div className="row">
            <div className="col-xl-12">
                <article>
                    <div className="activity-tab">
                        <div className="tab-content activity-content" id="pills-tabContent">
                            <div className="tab-pane fade mentions-section active show" id="pills-mentions" role="tabpanel" aria-labelledby="pills-mentions-tab">
                                {user.email == profile.email &&
                                    <div className="create-post mb-20">
                                        <form className="lab-inner" onSubmit={handleSubmit}>
                                            <div className="lab-thumb">
                                                <div className="thumb-inner">
                                                    <div className="thumb-img">
                                                        <img src={profile?.photoURL} alt="img" width={60} />
                                                    </div>
                                                    <div className="thumb-content">
                                                        <h6><a>{profile.name}</a></h6>
                                                        <div className="custom-select">
                                                            <select name='privacy'>
                                                                <option value="1">  Public &nbsp;</option>
                                                                <option value="2" disabled>  Friends &nbsp;</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="lab-content">
                                                <div className="post-form">
                                                    <input type="text" name='text' placeholder="Whats on your mind?" />
                                                    <div className="content-type">
                                                        <ul className="content-list">
                                                            <li className="text"><a>
                                                                <i className="icofont-edit"></i>
                                                                Text
                                                            </a></li>
                                                            <li className="image-video">
                                                                <div className="file-btn"><i className="icofont-camera"></i>
                                                                    <span>Photo</span></div>
                                                                <input onChange={fileChangedTrigger} type="file" name='imagefile' accept="image/*" />
                                                            </li>
                                                            <li className="post-submit">
                                                                <button type="submit" className="lab-btn">Post</button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>}


                                {posts.length > 0 ? posts.map((post) => {
                                    return <div className="post-item mb-20" key={post._id}>
                                        <div className="post-content">
                                            <div className="post-author">
                                                <div className="post-author-inner">
                                                    <div className="author-thumb">
                                                        <img src={profile?.photoURL} alt="img" width={60} />
                                                    </div>
                                                    <div className="author-details">
                                                        <h6><a href="#">{profile.name}</a></h6>
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
                                                        <a>
                                                            <i className="icofont-speech-comments"></i>
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
                            </div>
                        </div>
                    </div>
                </article>
            </div>
            <Comments comments={comments} loadComments={loadComments}></Comments>
        </div>
    );
};

export default Postarea;