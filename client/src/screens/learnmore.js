import React from "react";
import "css/learnmore.css";
import styled from "styled-components";
import { THEME_COLORS } from "constants";
import { useMediaQuery } from "react-responsive";



const Wrapper = styled.div`
  width: 100%;
  .title-container {
    text-align: center;
    color: #3c3293;
    font-size: 2em;
    margin-top: 5%;
  }
`;

const LearnMoreWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
  margin-top: 2%;
  text-align: left;
  font-family: Montserrat;

  .section {
    margin-bottom: 2%;
  }

  .title-text-box {
    font-size: ${(props) =>
      props.mobile === "true" || props.tablet === "true" ? 16 : 24}px;
    margin-top: 2%;
    color: ${THEME_COLORS.PURPLE};
  }

  .text-box {
    font-size: ${(props) =>
      props.mobile === "true" || props.tablet === "true" ? 12 : 18}px;
    margin-top: 2%;
    padding: ${(props) =>
      props.mobile === "true" || props.tablet === "true" ? 10 : 30}px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

    ul {
      list-style-type: disc;
      padding-left: 20px;

      li {
        padding: 5px 0;
      }
    }
  }

  .info-text {
    padding: 10px;
  }

  .vertical-line {
    width: 1px;
    background-color: #3c3293;
    margin: 0 20px;
  }
`;

const LearnMoreScreen = () => {
  const ismobile = useMediaQuery({ query: "(max-width: 800px)" });
  const istablet = useMediaQuery({ query: "(max-width: 1200px)" });

  return (
    <Wrapper>
      <div className="title-container">
        <h1>Learn More about ProudMe!</h1>
      </div>
      <LearnMoreWrapper mobile={ismobile.toString()} tablet={istablet.toString()}>
        <div className="section">
          <div className="title-text-box">
            What is ProudMe?
          </div>
          <div className="text-box">
            <p>
              Project ProudMe is an adolescent obesity prevention intervention based in Louisiana. The project is led by Dr. Senlin Chen and his team. ProudMe hopes to improve the lives of middle school students by teaching them how to set achievable goals.
            </p>
          </div>
        </div>

        <div className="section">
          <div className="title-text-box">
            What are SMART Goals?
          </div>
          <div className="text-box">
            <ul>
              <li>Set Fun Goals: Learn how to set SMART goals which are Specific, Measurable, Achievable, Relevant, and Time-bound.</li>
              <li>Track Your Progress: Use our interactive charts to see how well you’re doing.</li>
              <li>Stay Motivated: Get tips and encouragement to achieve your goals.</li>
            </ul>
          </div>
        </div>

        <div className="section">
          <div className="title-text-box">
            PE Resources
          </div>
          <div className="text-box">
            <ul>
              <li>Exciting Activities: Discover fun physical activities that keep you moving.</li>
              <li>Easy Lessons: Follow along with our step-by-step PE lessons.</li>
              <li>Teacher Tools: Access resources and videos to help teach and learn.</li>
            </ul>
          </div>
        </div>

        <div className="section">
          <div className="title-text-box">
            Learn More About Healthy Eating
          </div>
          <div className="text-box">
            <ul>
              <li>Yummy Tips: Find out how to make healthy food choices.</li>
              <li>Fun Recipes: Try out easy and delicious recipes.</li>
              <li>Cafeteria Changes: Learn about our efforts to make school lunches healthier.</li>
            </ul>
          </div>
        </div>

        <div className="section">
          <div className="info-text">
            Join us and start your journey to a healthier, happier you!
          </div>
        </div>
      </LearnMoreWrapper>
    </Wrapper>
  );
};

export default LearnMoreScreen;
