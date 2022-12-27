import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Contexts/UserContext';

const Editprofile = ({ profile }) => {
    const { updateUser, loading, setLoading, modal_close, logOut } = useContext(AuthContext);

    const [error, setError] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const photoURL = form.photoURL.value;
        const gender = form.gender.value;
        const looking_for = form.looking_for.value;
        const marital_status = form.marital_status.value;
        const age = form.age.value;

        setError(null);

        if (name.length < 1) {
            setError('Enter your name.');
            setLoading(false);
            return;
        }

        if (photoURL.length < 0) {
            setError('Enter photo URL.');
            setLoading(false);
            return;
        }

        if (gender.length < 1) {
            setError('Select gender.');
            setLoading(false);
            return;
        }

        updateUser(name, photoURL).then(() => {
            let data = { _id: profile._id, photoURL, gender, name, looking_for, marital_status, age};

            fetch(process.env.REACT_APP_SERVER_URL + `/updateProfile?email=${profile.email}`, {
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
                    toast('successfully saved');
                    form.reset();
                    modal_close();
                    setLoading(false);
                })
        })
            .catch(error => {
                setLoading(false); toast(error.message);
            });

    }

    return (<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <form className="modal-dialog modal-dialog-scrollable" onSubmit={handleSubmit}>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Edit Profile</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    {error ? <p className='alert alert-danger'>{error}</p> : ''}
                    <div className="form-group">
                        <input className="form-control" id="fullName" defaultValue={profile?.name} type="text" name='name' placeholder="Your name" required="" />
                    </div>
                    <div className="form-group mt-4">
                        <input readOnly className="form-control" id="exampleFormControlInput1" defaultValue={profile?.email} name='email' type="email" placeholder="Exampl@email.com" required="" />
                    </div>
                    <div className="form-group mt-4">
                        <div className="password-wrap position-relative">
                            <input className="form-control pe-5" id="inputphotoURL" defaultValue={profile?.photoURL} name="photoURL" type="text" placeholder="Enter photoURL" required="" />
                        </div>
                    </div>
                    <select className="form-select mt-4" name='gender' required>
                        <option value="">Gender</option>
                        <option selected={profile?.gender == 'Male' ? 'selected' : ''}>Male</option>
                        <option selected={profile?.gender == 'Female' ? 'selected' : ''}>Female</option>
                        <option selected={profile?.gender == 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                    <select className="form-select mt-4" name='looking_for' required>
                        <option value="">Looking for</option>
                        <option selected={profile?.looking_for == 'Male' ? 'selected' : ''}>Male</option>
                        <option selected={profile?.looking_for == 'Female' ? 'selected' : ''}>Female</option>
                        <option selected={profile?.looking_for == 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                    <select className="form-select mt-4" name='marital_status' required>
                        <option value="">Marital status</option>
                        <option selected={profile?.marital_status == 'Single' ? 'selected' : ''}>Single</option>
                        <option selected={profile?.marital_status == 'In a relationship' ? 'selected' : ''}>In a relationship</option>
                        <option selected={profile?.marital_status == 'Married' ? 'selected' : ''}>Married</option>
                    </select>
                    <div className="form-group mt-4">
                        <input className="form-control" defaultValue={profile?.age} min="10" name='age' type="number" placeholder="Age" required="" />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>Save changes</button>
                </div>
            </div>
        </form>
    </div>
    );
};

export default Editprofile;