import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Contexts/UserContext';
import { toast } from 'react-toastify';
import useDocumentTitle from '../../Layout/useDocumentTitle';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import Editprofile from '../Modals/Editprofile';

const Profile = () => {
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    let location = useLocation()

    useDocumentTitle("Profile");
    const { user, logOut } = useContext(AuthContext);
    const [profile, setProfile] = useState({});
    const [email, setEmail] = useState(null);

    const reloadProfile = () => {
        if (email) {
            fetch(process.env.REACT_APP_SERVER_URL + `/getProfile?email=${email}`, {
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
                    setProfile(res);
                })
                .catch(error => {
                    toast(error.message);
                    navigate('/error');
                });
        }
    }

    const follow_unfollow = (task = 'follow') => {
        let data = { email: user.email, follow: email };
        fetch(process.env.REACT_APP_SERVER_URL + `/follow_unfollow?task=${task}`, {
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
            .then(res => {
                reloadProfile();
                toast(`${task} success.`);
            })
    }

    useEffect(reloadProfile, [logOut, email]);

    useEffect(() => {
        if (searchParams.get("email")) {
            setEmail(searchParams.get("email"));
        } else {
            setEmail(user?.email);
        }
    }, [location])

    return (
        <section className="profile-section pt-5" style={{ background: '#391965' }}>
            <div className="container">
                <div className="section-wrapper">
                    <div className="member-profile">
                        <div className="profile-item">
                            <div className="profile-cover">
                            </div>
                            <div className="profile-information">
                                <div className="profile-pic">
                                    <img src={profile?.photoURL} alt="DP" />
                                    {user.email == profile.email && <div className="custom-upload">
                                        <div className="file-btn">
                                            <span className="d-none d-lg-inline-block"> <i className="icofont-camera"></i>
                                                Edit</span>
                                            <span className="d-lg-none mr-0" wfd-invisible="true"><i className="icofont-plus"></i></span></div>
                                        <input type="file" name='changeDP' accept="image/*" />
                                    </div>}
                                </div>
                                <div className="profile-name">
                                    <h4>{profile.name}</h4>
                                    <p>{profile?.status == 'Verified' ? <><i className="icofont-check-circled"></i> Verified</> : <><i className="icofont-not-allowed"></i> Unverified</>}</p>
                                </div>
                                {user.email != profile.email && <ul className="profile-contact">
                                    <li>
                                        {profile?.already_follower ? <a onClick={() => follow_unfollow("unfollow")}>
                                            <div className="icon"><i className="icofont-user"></i></div>
                                            <div className="text">
                                                <p>Unfollow</p>
                                            </div>
                                        </a> : <a onClick={() => follow_unfollow()}>
                                            <div className="icon"><i className="icofont-user"></i></div>
                                            <div className="text">
                                                <p>Follow</p>
                                            </div>
                                        </a>}
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div className="icon"><i className="icofont-envelope"></i></div>
                                            <div className="text">
                                                <p>Message</p>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                                }{user.email == profile.email && <ul className="profile-contact">
                                    <li>
                                        <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                            <div className="icon"><i className="icofont-user"></i></div>
                                            <div className="text">
                                                <p>Edit Profile</p>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                                }

                            </div>
                        </div>


                        <div className="profile-details">
                            <nav className="profile-nav">
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button className="nav-link active" id="nav-ativity-tab" data-bs-toggle="tab" data-bs-target="#activity" type="button" role="tab" aria-controls="activity" aria-selected="true">Activity</button>
                                    <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profile</button>
                                    <button className="nav-link" id="nav-friends-tab" data-bs-toggle="tab" data-bs-target="#friends" type="button" role="tab" aria-controls="friends" aria-selected="false">Follower <span className="item-number">{profile?.total_follower && profile.total_follower.length}</span></button>
                                </div>
                            </nav>
                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane activity-page fade active show" id="activity" role="tabpanel">
                                    <div>
                                        <div className="row">
                                            <div className="col-xl-12">
                                                <article>
                                                    <div className="activity-tab">
                                                        <div className="tab-content activity-content" id="pills-tabContent">
                                                            <div className="tab-pane fade mentions-section active show" id="pills-mentions" role="tabpanel" aria-labelledby="pills-mentions-tab">
                                                                {user.email == profile.email && <div className="create-post mb-20">
                                                                    <div className="lab-inner">
                                                                        <div className="lab-thumb">
                                                                            <div className="thumb-inner">
                                                                                <div className="thumb-img">
                                                                                    <img src={profile?.photoURL} alt="img" width={60} />
                                                                                </div>
                                                                                <div className="thumb-content">
                                                                                    <h6><a href="#">
                                                                                        {profile.name}
                                                                                    </a>
                                                                                    </h6>
                                                                                    <div className="custom-select">
                                                                                        <select>
                                                                                            <option value="1">  Public &nbsp;</option>
                                                                                            <option value="2" disabled>  Friends &nbsp;</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="lab-content">
                                                                            <form className="post-form">
                                                                                <input type="text" placeholder="Whats on your mind?" />
                                                                                <div className="content-type">
                                                                                    <ul className="content-list">
                                                                                        <li className="text"><a>
                                                                                            <i className="icofont-edit"></i>
                                                                                            Text
                                                                                        </a></li>
                                                                                        <li className="image-video">
                                                                                            <div className="file-btn"><i className="icofont-camera"></i>
                                                                                                Photo</div>
                                                                                            <input type="file" name='photo' accept="image/*" />
                                                                                        </li>
                                                                                        <li className="post-submit">
                                                                                            <input type="submit" value="Post" className="lab-btn" />
                                                                                        </li>
                                                                                    </ul>
                                                                                </div>
                                                                            </form>
                                                                        </div>
                                                                    </div>
                                                                </div>}


                                                                <div className="post-item mb-20">
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
                                                                                        <li className="post-time">6 Mintues Ago
                                                                                        </li>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="post-description">
                                                                            <p>
                                                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum blanditiis omnis explicabo beatae consequatur assumenda, dolor deleniti, temporibus perspiciatis id qui! Mollitia, sed pariatur? Doloremque cupiditate maiores tenetur nam minima.
                                                                            </p>
                                                                            <div className="post-desc-img">
                                                                                <div className="row g-3">
                                                                                    <div className="col-md-8 mx-auto">
                                                                                        <img src="assets/images/profile/post-image/02.jpg" alt="img" width="100%" />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="post-meta">
                                                                        <div className="post-meta-top">
                                                                            <p><a href="#"><i className="icofont-like"></i> <span>306 like this</span></a>
                                                                            </p>
                                                                            <p>
                                                                                <a href="#">136 Comments</a>
                                                                            </p>
                                                                        </div>
                                                                        <div className="post-meta-bottom">
                                                                            <ul className="react-list">
                                                                                <li className="react"><a href="#"><i className="icofont-like"></i>
                                                                                    Like</a> </li>
                                                                                <li className="react"><a href="#">
                                                                                    <i className="icofont-speech-comments"></i>
                                                                                    Comment
                                                                                </a></li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="load-btn">
                                                                    <a href="#" className="lab-btn">Load More Post <i className="icofont-spinner"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="nav-profile-tab" wfd-invisible="true">
                                    <div>
                                        <div className="row">
                                            <div className="col-xl-12">
                                                <article>
                                                    <div className="info-card mb-20">
                                                        <div className="info-card-title">
                                                            <h6>Base Info</h6>
                                                        </div>
                                                        <div className="info-card-content">
                                                            <ul className="info-list">
                                                                <li>
                                                                    <p className="info-name">Name</p>
                                                                    <p className="info-details">{profile.name}</p>
                                                                </li>
                                                                <li>
                                                                    <p className="info-name">I'm a</p>
                                                                    <p className="info-details">{profile?.gender}</p>
                                                                </li>
                                                                <li>
                                                                    <p className="info-name">Looking for a</p>
                                                                    <p className="info-details">{profile?.looking_for}</p>
                                                                </li>
                                                                <li>
                                                                    <p className="info-name">Marital Status</p>
                                                                    <p className="info-details">{profile?.marital_status}</p>
                                                                </li>
                                                                <li>
                                                                    <p className="info-name">Age</p>
                                                                    <p className="info-details">{profile?.age}</p>
                                                                </li>
                                                            </ul>

                                                        </div>
                                                    </div>
                                                </article>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="friends" role="tabpanel" aria-labelledby="nav-friends-tab" wfd-invisible="true">
                                    <div>
                                        <div className="row">
                                            <div className="col-xl-12">
                                                <article>
                                                    <div className="row gy-4 gx-3 justify-content-center">
                                                        {profile.total_follower ? profile.total_follower.map((u) => {
                                                            return <div key={u._id} className="col-lg-3 col-md-4 col-6">
                                                                <div className="lab-item member-item style-1">
                                                                    <div className="lab-inner">
                                                                        <div className="lab-thumb">
                                                                            <img src={u.details[0].photoURL} alt="member-img" />
                                                                        </div>
                                                                        <div className="lab-content">
                                                                            <h6><a href="#">{u.details[0].name}</a> </h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }) : <p className='col-md-12'>No Follower Found.</p>}

                                                    </div>
                                                </article>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Editprofile profile={profile}></Editprofile>
        </section>
    );
};

export default Profile;