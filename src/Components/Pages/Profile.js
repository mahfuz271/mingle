import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Contexts/UserContext';
import { toast } from 'react-toastify';
import useDocumentTitle from '../../Layout/useDocumentTitle';
import { useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import Editprofile from '../Modals/Editprofile';
import Postarea from '../Post/Postarea';

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
        if (profile) {
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
        <section className="profile-section pt-5">
            <div className="container">
                <div className="section-wrapper">
                    <div className="member-profile">
                        <div className="profile-item">
                            <div className="profile-cover">
                            </div>
                            <div className="profile-information">
                                <div className="profile-pic">
                                    <img src={profile?.photoURL} alt="DP" />
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
                                        <Link to={`/message?email=${profile.email}`}>
                                            <div className="icon"><i className="icofont-envelope"></i></div>
                                            <div className="text">
                                                <p>Message</p>
                                            </div>
                                        </Link>
                                    </li>
                                </ul>
                                }{user.email == profile.email && <ul className="profile-contact">
                                    <li>
                                        <a data-bs-toggle="modal" data-bs-target="#exampleModal">
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
                                    {profile && <Postarea limitpost={20} profile={profile} createpost={true} sortby={'created'}></Postarea>}
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
                                                                    <p className="info-name">University</p>
                                                                    <p className="info-details">{profile?.university}</p>
                                                                </li>
                                                                <li>
                                                                    <p className="info-name">Address</p>
                                                                    <p className="info-details">{profile?.address}</p>
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
                                                        {profile.total_follower && profile.total_follower.length > 0 ? profile.total_follower.map((u) => {
                                                            return <Link to={`/profile?email=` + u.details[0].email} key={u._id} className="col-lg-3 col-md-4 col-6">
                                                                <div className="lab-item member-item style-1">
                                                                    <div className="lab-inner">
                                                                        <div className="lab-thumb">
                                                                            <img src={u.details[0].photoURL} alt="member-img" />
                                                                        </div>
                                                                        <div className="lab-content">
                                                                            <h6>{u.details[0].name}</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        }) : <div className="info-card mb-20"><div className="info-card-title"><p className='col-md-12 mb-5 mt-5 text-center'>No Follower Found.</p></div></div>}

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