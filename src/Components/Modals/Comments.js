import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Contexts/UserContext';

const Comments = ({ comments, loadComments }) => {
    const { logOut, user } = useContext(AuthContext);

    const handleCommentSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const text = form.text.value;
        const id = form.id.value;

        let data = { pid: id, text, email: user.email, name: user.displayName, photoURL: user.photoURL };

        fetch(process.env.REACT_APP_SERVER_URL + `/addComment`, {
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
                toast('successfully added');
                form.reset();
                loadComments(id);
            })

    }

    return (
        <div className="modal fade" id="commentModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <form className="modal-dialog modal-dialog-scrollable" onSubmit={handleCommentSubmit}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Comments</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <input type="hidden" name="id" className='id' />
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" name='text' placeholder="Your comment" aria-describedby="button-addon2" required />
                            <button className="btn btn-primary" type="submit" id="button-addon2">Submit</button>
                        </div>
                        <div className='comments'>

                            {comments.length > 0 ? comments.map((comment) => {
                                return <div className="card mb-4" key={comment._id}>
                                    <div className="card-body">
                                        <p>{comment.text}</p>
                                        <div className="d-flex justify-content-between">
                                            <div className="d-flex flex-row align-items-center">
                                                <img src={comment.photoURL} alt="avatar" width="25" height="25" />
                                                <p className="small mb-0 ms-2">{comment.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }) : <div className="card mb-4">
                                <div className="card-body"><p>No Comments</p></div></div>}

                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Comments;