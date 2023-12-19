import React from "react";
import 'css/pe.css';
import YoutubeEmbed from "components/pe/YoutubeEmbed.js";
import withAuth from 'components/auth/withAuth';

const PEScreen = () => {
    return (
    <div className="pe">
      <h1 className="pe-header">ProudMe PE Video Lessons</h1>
      <div className="video-list">
        <YoutubeEmbed embedId="K4TOrB7at0Y" />
      </div>
    </div>
    )
}

export default withAuth(PEScreen);