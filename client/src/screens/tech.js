import React from "react";
import "css/tech.css";
import YoutubeEmbed from "components/pe/YoutubeEmbed.js";
import withAuth from "components/auth/withAuth";

const TechScreen = () => {
  return (
    <div className="tech">
      <h1 className="tech-header">ProudMe Tech Help/Walkthrough</h1>
      <div className="info-text">
        This guide is a basic how-to tutorial to use the website. It highlights
        the main features like the journal page, behavior charts, ProudMe PE
        activity module and ProudMe cafeteria assessment module. It is primarily
        designed for both students and instructors to use when they are confused
        or want to start using the website.
      </div>
      <br />
      <div className="video-list">
        <YoutubeEmbed embedId="S9UZ8HTPw3w" />
      </div>
    </div>
  );
};

export default withAuth(TechScreen);
