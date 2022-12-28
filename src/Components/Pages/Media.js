import React from 'react';
import Postarea from '../Post/Postarea';
import useDocumentTitle from '../../Layout/useDocumentTitle';

const Media = () => {
    useDocumentTitle("All Media");
    return (
        <div className='container pt-5'>
            <h3 className='text-light'>All Media</h3>
            <Postarea limitpost={30} profile={'all'} createpost={false} sortby="created"></Postarea>
        </div>
    );
};

export default Media;