import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
    return (
        <div className='text-center my-5'>
            <img src="/img/error.png" alt="" width={100} />
            <h1 className='text-light'>
                Oops!</h1>
            <h2 className='text-light'>
                404 Not Found</h2>
            <div className='text-light'>
                Sorry, an error has occured, Requested page not found!
            </div>
            <Link className="lab-btn text-light mt-5" to="/">Back to Home</Link>
        </div>
    );
};

export default Error;