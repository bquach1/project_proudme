import React from "react";
import '../../css/pe.css';
import YoutubeEmbed from "../../components/YoutubeEmbed.js";

const PEScreen = () => {
    return (
    <div className="pe">
      <h1 className="pe-header">ProudME PE Video Lessons</h1>
      <div className="video-list">
        <YoutubeEmbed embedId="K4TOrB7at0Y" />
      </div>
    </div>
    )
}

export default PEScreen;