import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/UserContext';
import { toast } from 'react-toastify';
import useDocumentTitle from '../../Layout/useDocumentTitle';
import useLogin from '../../hooks/useLogin';

const Signup = () => {
    useDocumentTitle("Signup");
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const { createUser, updateUser, loading, setLoading, signInWithGoogle } = useContext(AuthContext);
    const [LoginInfo, setLoginInfo] = useState({
        email: null,
        name: null,
        role: null,
        insert: false
    });
    const [token] = useLogin(LoginInfo);


    const jwtANDUsers = (result, role = 'user') => {
        setLoading(true);
        setLoginInfo({
            email: result.user.email,
            name: result.user.displayName,
            role,
            insert: true
        }); setTimeout(() => {
            toast("Signup success!");
            setLoading(false);
            navigate('/');
        }, 1000);
    }


    const handleGoogleSignIn = (event) => {
        signInWithGoogle().then(jwtANDUsers)
            .catch(error => { toast(error.message); setLoading(false); });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const name = form.name.value;
        const photoURL = form.photoURL.value;
        const password = form.password.value;
        const account_type = 'user';

        setError(null);

        if (name.length < 1) {
            setError('Enter your name.');
            setLoading(false);
            return;
        }

        if (email.length < 1) {
            setError('Enter your Email.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password should be 6 characters or more.');
            setLoading(false);
            return;
        }

        if (photoURL.length < 6) {
            setError('Enter photo URL.');
            setLoading(false);
            return;
        }

        createUser(email, password)
            .then(result => {
                updateUser(name, photoURL).then(() => {
                    form.reset();
                    jwtANDUsers(result, account_type);
                })
                    .catch(error => { toast(error.message); setLoading(false); });
            })
            .catch(error => { toast(error.message); setLoading(false); });

    }

    return (

        <div className="login-section pt-5">
            <div className=" container">
                <div className="account-wrapper">
                    <h3 className="title">Register Now</h3>
                    <form className="account-form" onSubmit={handleSubmit}>

                        {error ? <p className='alert alert-danger'>{error}</p> : ''}
                        <div className="form-group">
                            <label className="form-label text-primary d-flex" htmlFor="fullName">Full name</label>
                            <input className="form-control" id="fullName" type="text" name='name' placeholder="Your name" required="" />
                        </div>
                        <div className="form-group mt-4">
                            <label className="form-label text-primary d-flex" htmlFor="exampleFormControlInput1">Email address</label>
                            <input className="form-control" id="exampleFormControlInput1" name='email' type="email" placeholder="Exampl@email.com" required="" />
                        </div>
                        <div className="form-group mt-4">
                            <label className="form-label text-primary d-flex" htmlFor="inputPassword5">Password</label>
                            <div className="password-wrap position-relative">
                                <input className="form-control pe-5" id="inputPassword5" name="password" type="password" placeholder="Enter password" required="" />
                            </div>
                        </div>
                        <div className="form-group mt-4">
                            <label className="form-label text-primary d-flex" htmlFor="inputphotoURL">Photo URL</label>
                            <div className="password-wrap position-relative">
                                <input className="form-control pe-5" id="inputphotoURL" name="photoURL" type="text" placeholder="Enter photoURL" required="" />
                            </div>
                        </div>
                        <div className="form-group">
                            <button type='submit' disabled={loading} className="d-block lab-btn"><span>Get Started Now</span></button>
                        </div>
                    </form>
                    <div className="account-bottom">
                        <span className="d-block cate pt-10">Are you a member?  <Link className="text-focus" to="/login">Login</Link></span>
                        <span className="or"><span>or</span></span>
                        <h5 className="subtitle">Signup With Social Media</h5>
                        <button className="btn btn-outline-secondary w-100 submit-btn" type="button" onClick={handleGoogleSignIn} ><img className="me-3" src="/img/google-icon.svg" alt="Google" />Google</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;