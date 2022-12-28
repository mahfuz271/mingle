import React from 'react';
import Createpost from '../Modals/Createpost';
import Postarea from '../Post/Postarea';

const Homepage = () => {
    return (
        <div className='container pt-5'>
            <Createpost profile={'all'} reloadPosts={(i) => { }}></Createpost>
            <h3 className='text-light'>Most Liked Post</h3>
            <Postarea limitpost={3} profile={'all'} createpost={false} sortby="like_count"></Postarea>
        </div>
    );
};

export default Homepage;