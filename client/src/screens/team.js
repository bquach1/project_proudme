import React from "react";
import "css/team.css";
import styled from "styled-components";

const TeamWrapper = styled.div`
  font-family: Montserrat;
  padding-bottom: 2%;
`;

const BioRow = styled.div`
  padding-top: 2%;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  width: 90%;
`;

const Bio = styled.div`
  display: flex;
  flex-direction: column;
  width: 27%;
  border-radius: 100%;
  margin: 0 auto;
`;

const BioImage = styled.img`
  border-radius: 100%;
  width: 100%;
  margin-bottom: 2%;
`;

const TeamScreen = () => {
  return (
    <TeamWrapper>
      <h1 style={{ color: "#2E6AA1", marginTop: "1%" }}>Our Team</h1>
      <BioRow style={{ marginTop: "1%" }}>
        <Bio>
          <BioImage src={require("components/images/team/qiaoyin.png")} />
          <strong>Qiaoyin (Joy) Tan</strong>
          <strong>Kinesiology Graduate Researcher</strong>
          <div>
            Qiaoyin Tan, known as Joy, holds a master's in education and is
            currently pursuing a Doctor of Philosophy in Kinesiology in LSUPK
            lab. Joy's research spans various areas, including motor injury
            repair and health promotion through sports. She has received
            recognition for her academic achievements, including the National
            Scholarship for University Students and Outstanding Graduate awards.
            Joy's research contributions have been published in reputable
            journals, and she actively participates in academic conferences. Her
            dedication to advancing knowledge in the field of kinesiology
            reflects her passion for health and physical well-being.
          </div>
        </Bio>
        <Bio>
          <BioImage src={require("components/images/team/jena.jpg")} />
          <strong>Virginia Bordelon</strong>
          <strong>Kinesiology Undergraduate Researcher</strong>
          <div>
            My name is Virginia Bordelon and I am an LSU undergraduate student
            pursuing a degree in Kinesiology. I have a passion for nutrition,
            specifically for the younger generation along with their education.
            I believe that we have a key role in providing essential nutrition,
            physical education, and overall healthy habits for future
            generations to come. I plan on using my degree to be of aid to those
            unable to assist themselves through a career in healthcare. The
            Smarter Lunchroom Scorecard, an application that allows analyzation
            of environments and nutrition in schools, is a major factor in my
            involvement with Project ProudMe.
          </div>
        </Bio>
        <Bio>
          <BioImage src={require("components/images/team/bruce.jpeg")} />
          <strong>Bruce Quach</strong>
          <strong>Web Developer</strong>
          <div>
            I'm currently a senior undergraduate student at Louisiana State
            University majoring in computer science with a concentration in
            software engineering. I have a passion for web development and enjoy
            watching shows, playing games, and posting on my food account in my
            free time.
          </div>
        </Bio>
      </BioRow>
      <BioRow>
        <Bio>
          <BioImage src={require("components/images/team/ashish.jpeg")} />
          <strong>Ashish Kumar</strong>
          <strong>AI Developer</strong>
          <div>
            I am a graduate student at Texas A&M University majoring in computer
            Science. I have completed my bachelor degree in Electrical and
            Electronics Engineering from NIT Trichy, India. My research interest
            lies in AI/Machine learning and computer Systems. I love cooking and
            travelling.
          </div>
        </Bio>
      </BioRow>
    </TeamWrapper>
  );
};

export default TeamScreen;
