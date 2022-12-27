import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Contexts/UserContext';
import { toast } from 'react-toastify';
import useDocumentTitle from '../../Layout/useDocumentTitle';
import { useSearchParams, useLocation } from 'react-router-dom';

const Profile = () => {
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
                });
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
        <section className="profile-section padding-tb">
            <div className="container">
                <div className="section-wrapper">
                    <div className="member-profile">
                        <div className="profile-item">
                            <div className="profile-cover">
                            </div>
                            <div className="profile-information">
                                <div className="profile-pic">
                                    <img src={profile?.photoURL} alt="DP" />
                                    <div className="custom-upload">
                                        <div className="file-btn">
                                            <span className="d-none d-lg-inline-block"> <i className="icofont-camera"></i>
                                                Edit</span>
                                            <span className="d-lg-none mr-0" wfd-invisible="true"><i className="icofont-plus"></i></span></div>
                                        <input type="file" name='changeDP' />
                                    </div>
                                </div>
                                <div className="profile-name">
                                    <h4>{profile.name}</h4>
                                    <p>{profile?.status == 'Verified' ? <><i class="icofont-check-circled"></i>Verified</> : <><i class="icofont-not-allowed"></i> Unverified</>}</p>
                                </div>
                                <ul className="profile-contact">
                                    <li>
                                        <a href="#">
                                            <div className="icon"><i className="icofont-user"></i></div>
                                            <div className="text">
                                                <p>Follow</p>
                                            </div>
                                        </a>
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

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;