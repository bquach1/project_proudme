import React from 'react';
import withAuth from 'components/auth/withAuth';

const GalleryScreen = () => {
    return (
        <div className="gallery">
            <h1>Gallery Screen</h1>
        </div>
    );
};

export default withAuth(GalleryScreen);