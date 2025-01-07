import React, { useState, useEffect, useRef } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import styled from "styled-components";

const ExpandableTextWrapper = styled.div`
  position: relative;
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 10px;
  width: 100%;          // Fix the width
  max-height: 90px;
  margin-bottom: 20px;
  overflow-y: auto;     // Only vertical scrolling
  overflow-x: hidden;   // Prevent horizontal scrolling

  &:before {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -15px;
    border-width: 15px;
    border-style: solid;
    border-color: transparent transparent #f0f0f0 transparent;
  }

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const TextContainer = styled.div`
  color: #000080;
  font-size: 12px;
  padding: 5px;
  padding-right: 10px;
  width: calc(100% - 10px); // Account for scrollbar
  word-wrap: break-word;
  white-space: pre-wrap;
`;

function ExpandableText({ text, maxLines }) {
  const [displayedText, setDisplayedText] = useState("");
  const textRef = useRef(null);

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

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <ExpandableTextWrapper>
      <TextContainer ref={textRef}>
        {displayedText}
      </TextContainer>
    </ExpandableTextWrapper>
  );
}

export default ExpandableText;