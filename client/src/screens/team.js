import React from "react";
import "css/team.css";
import styled from "styled-components";

const TeamWrapper = styled.div`
  font-family: Montserrat;
`;

const BioRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  width: 90%;
`;

const Bio = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
  border-radius: 100%;
`;

const BioImage = styled.img`
  border-radius: 100%;
  width: 100%;
`;

const TeamScreen = () => {
  return (
    <TeamWrapper>
      <h1 style={{ color: "#2E6AA1", marginTop: "1%" }}>Our Team</h1>
      <BioRow style={{ marginTop: "1%" }}>
        <Bio>
          <BioImage src={require("components/images/team/bruce.jpeg")} />
          <strong>Bruce Quach</strong>
          <strong>Web Developer</strong>
          <div>
            Biography Biography Biography Biography Biography Biography
            Biography Biography Biography Biography Biography Biography
            Biography Biography Biography Biography Biography Biography
            Biography Biography
          </div>
        </Bio>
        <Bio>
          <BioImage src={require("components/images/team/bruce.jpeg")} />
          <strong>Bruce Quach</strong>
          <strong>Web Developer</strong>
          <div>
            Biography Biography Biography Biography Biography Biography
            Biography Biography Biography Biography Biography Biography
            Biography Biography Biography Biography Biography Biography
            Biography Biography
          </div>
        </Bio>
        <Bio>
          <BioImage src={require("components/images/team/bruce.jpeg")} />
          <strong>Bruce Quach</strong>
          <strong>Web Developer</strong>
          <div>
            Biography Biography Biography Biography Biography Biography
            Biography Biography Biography Biography Biography Biography
            Biography Biography Biography Biography Biography Biography
            Biography Biography
          </div>
        </Bio>
      </BioRow>
    </TeamWrapper>
  );
};

export default TeamScreen;
