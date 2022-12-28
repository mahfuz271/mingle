import React, { useContext } from 'react';
import { AuthContext } from '../../Contexts/UserContext';
import { toast } from 'react-toastify';

const Createpost = ({ profile, reloadPosts }) => {

    const imgHostKey = process.env.REACT_APP_imgbb_key;
    const { logOut, user } = useContext(AuthContext);

    const saveDetailsToServer = (post, form) => {
        if ((post.text || post.img) && (post.text != '' || post.img != '')) {
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
        }else{
            toast('empty.');
        }
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
    return (
        <div>{(user.email == profile?.email || profile == 'all') &&
            <div className="create-post mb-20">
                <form className="lab-inner" onSubmit={handleSubmit}>
                    <div className="lab-thumb">
                        <div className="thumb-inner">
                            <div className="thumb-img">
                                <img src={profile.photoURL ? profile.photoURL : user.photoURL} alt="img" width={60} />
                            </div>
                            <div className="thumb-content">
                                <h6><a>{profile.name ? profile.name : user.displayName}</a></h6>
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
        </div>
    );
};

export default Createpost;