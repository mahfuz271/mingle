import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../Contexts/UserContext';

const Header = () => {
    const { user } = useContext(AuthContext);
    let activeClassName = "active-link";
    let inActiveClass = "";

    return (
        <header className="header-section">
            <div className="header-bottom">
                <div className="container">
                    <div className="header-wrapper">
                        <div className="logo">
                            <Link to="/">
                                <img src="/logo.png" alt="logo" />
                            </Link>
                        </div>
                        <div className="menu-area">
                            <ul className="menu">
                                <li><NavLink to="/" className={(({ isActive }) => isActive ? activeClassName : inActiveClass)} end>Home</NavLink></li>
                                {user && <li><NavLink to="/profile" className={(({ isActive }) => isActive ? activeClassName : inActiveClass)} end>My Profile</NavLink></li>}
                                {user && <li><NavLink to="/messages" className={(({ isActive }) => isActive ? activeClassName : inActiveClass)} end>Messages</NavLink></li>}
                                {user && <li><NavLink to="/members" className={(({ isActive }) => isActive ? activeClassName : inActiveClass)} end>Members</NavLink></li>}
                                {user && <li><NavLink to="/media" className={(({ isActive }) => isActive ? activeClassName : inActiveClass)} end>Media</NavLink></li>}
                                {user && localStorage.getItem('role') == 'admin' ? <><li><NavLink to="/dashboard" className={(({ isActive }) => isActive ? activeClassName : inActiveClass)} end>Dashboard</NavLink></li>
                                </> : ''}
                            </ul>
                            {user ? <>
                                <Link to="#" className="d-block link-dark text-decoration-none"><img src={(user.photoURL) ? user.photoURL : "//dummyimage.com/60x60/666/ffffff&text=No+Image"} alt={user.displayName} title={user.displayName} width="32" height="32" className="rounded-circle" /></Link>
                                <Link to="/logout" className="btn btn-outline-danger ms-3 text-light">Logout</Link>
                            </> :
                                <>
                                    <Link to="/login" className="login"><i className="icofont-user"></i> <span>LOG IN</span> </Link>
                                    <Link to="/signup" className="signup"><i className="icofont-users"></i> <span>SIGN UP</span></Link>
                                </>}

                            <div className="header-bar d-lg-none">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;