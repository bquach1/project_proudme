import React, { useState, useEffect, useRef } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import styled from "styled-components";

const ExpandableTextWrapper = styled.div`
  .expand-icon {
    width: 80%;
    height: 20px;
    border-radius: 5px;
    cursor: pointer;
  }

  .expand-icon:hover {
    transition: background 0.4s;
    background-color: #ccc;
  }

  max-height: 100px;

  position: relative;
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 10px;
  max-width: 300px;

  &:before {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -15px; /* Half of the width of the triangle */
    border-width: 15px;
    border-style: solid;
    border-color: transparent transparent #f0f0f0 transparent;
  }
`;

function ExpandableText({ text, maxLines }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let intervalId;

    let currentIndex = -1;
    intervalId = setInterval(() => {
      currentIndex++;

      if (currentIndex === text.length - 1) {
        clearInterval(intervalId);
      }
      setDisplayedText((prevText) => prevText + text[currentIndex]);
    }, 30);

    return () => {
      clearInterval(intervalId);
    };
  }, [text]);

  const textStyles = {
    maxHeight: `${maxLines * 1.2}em`,
    overflow: "clip",
  };

  return (
    <ExpandableTextWrapper style={styles.feedback}>
      <p style={textStyles}>{displayedText}</p>
    </ExpandableTextWrapper>
  );
}

export default ExpandableText;

const styles = {
  feedback: {
    color: "#000080",
    padding: 5,
    overflowY: "scroll",
    maxHeight: 101,
    marginRight: -45,
    fontSize: 12,
    width: "110%",
  },
};
