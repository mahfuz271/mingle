import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/UserContext';
import { toast } from 'react-toastify';
import useDocumentTitle from '../../Layout/useDocumentTitle';
import useLogin from '../../hooks/useLogin';

const Login = () => {
    useDocumentTitle("Login");
    const { signIn, loading, setLoading, signInWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);
    const [role, setRole] = useState('user');
    const [LoginInfo, setLoginInfo] = useState({
        email: null,
        name: null,
        role,
        photoURL:null,
        insert: false,
        gender: null
    });
    const [token] = useLogin(LoginInfo);
    const from = location.state?.from?.pathname || '/';

    const jwt = (result, insert = true) => {
        setLoading(true);
        setLoginInfo({
            email: result.user.email,
            name: result.user.displayName,
            role,
            photoURL:result.user.photoURL,
            insert,
            gender:null
        }); setTimeout(() => {
            toast("Login success!");
            setLoading(false);
            navigate(from, { replace: true });
        }, 1000);

    }


    const handleGoogleSignIn = (event) => {
        signInWithGoogle().then(jwt)
            .catch(error => { toast(error.message); setLoading(false); });
    }
    const handleSubmit = event => {
        event.preventDefault();

        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        setError(null);

        if (email.length < 1) {
            setError('Enter your Email.');
            setLoading(false);
            return;
        }

        if (password.length < 1) {
            setError('Enter password.');
            setLoading(false);
            return;
        }

        signIn(email, password)
            .then(result => {
                jwt(result, false);
                form.reset();
            })
            .catch(error => { toast(error.message); setLoading(false); });
    }

    return (
        <div className="login-section pt-5">
            <div className=" container">
                <div className="account-wrapper">
                    <h3 className="title">Login</h3>
                    <form className="account-form" onSubmit={handleSubmit}>
                        {error ? <p className='alert alert-danger'>{error}</p> : ''}
                        <div className="form-group">
                            <input type="text" placeholder="Email" name="email" />
                        </div>
                        <div className="form-group">
                            <input type="password" placeholder="Password" name="password" />
                        </div>
                        <div className="form-group">
                            <div className="d-flex justify-content-between flex-wrap pt-sm-2">
                                <div className="checkgroup">
                                    <input type="checkbox" name="remember" id="remember" />
                                        <label htmlFor="remember">Remember Me</label>
                                </div>
                                <a href="#">Forget Password?</a>
                            </div>
                        </div>
                        <div className="form-group">
                            <button type='submit' disabled={loading} className="d-block lab-btn"><span>Submit Now</span></button>
                        </div>
                    </form>
                    <div className="account-bottom">
                        <span className="d-block cate pt-10">Don’t Have any Account? <Link className="text-focus" to="/signup">Sign up</Link></span>
                        <span className="or"><span>or</span></span>
                        <h5 className="subtitle">Login With Social Media</h5>
                        <button className="btn btn-outline-secondary w-100 submit-btn" type="button" onClick={handleGoogleSignIn} ><img className="me-3" src="/img/google-icon.svg" alt="Google" />Google</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;