import React from "react";
import { Box, LinearProgress } from "@mui/material";
import styled from "styled-components";

const ProgressBox = styled(Box)`
`

const ProgressBar = styled.div`
`;

const BehaviorProgressBar = ({ data, chartGoalType }) => {
  const totalBehaviorValue = data.reduce(
    (total, entry) => total + entry.behaviorValue,
    0
  );
  const totalRecommendedValue = data.reduce(
    (total, entry) => total + entry.recommendedValue,
    0
  );

  const overallProgress = (totalBehaviorValue / totalRecommendedValue) * 100;

  return (
    <ProgressBox sx={{ width: "80%" }} position="relative">
      <div style={{
        content: '""',
        position: "absolute",
        width: "2px",
        background: "red", // Change the color of the vertical line
        top: 0,
        bottom: 0,
        zIndex: 1,
        left: `calc(100% - ${2*totalBehaviorValue}px)`, // Adjust the position of the line
      }}></div>
      <ProgressBar
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LinearProgress
          variant="determinate"
          value={Math.min(overallProgress, 100)}
          style={{ height: 50, borderRadius: 10, flex: 1, margin: 10 }}
          sx={{
            "& .MuiLinearProgress-bar": {
              background:
                overallProgress <= 100
                  ? "#77DD77"
                  : "linear-gradient(to right, #FF6961, #FFC000)",
              backgroundColor:
                chartGoalType === "screentime" &&
                totalBehaviorValue > totalRecommendedValue * 2
                  ? "#FF6961"
                  : chartGoalType === "screentime" &&
                    totalBehaviorValue === totalRecommendedValue
                  ? "#8884d8"
                  : chartGoalType === "screentime" &&
                    totalBehaviorValue > totalRecommendedValue
                  ? "#FFC000"
                  : chartGoalType === "screentime" &&
                    totalBehaviorValue < totalRecommendedValue
                  ? "#77DD77"
                  : totalBehaviorValue > totalRecommendedValue
                  ? "#77DD77"
                  : totalBehaviorValue === totalRecommendedValue
                  ? "#8884d8"
                  : totalBehaviorValue < totalRecommendedValue / 2
                  ? "#FF6961"
                  : "#FFC000",
            },
          }}
        />
        <div style={{ width: "10%" }}>
          {+parseFloat(totalBehaviorValue).toFixed(2)} / {totalRecommendedValue}
        </div>
      </ProgressBar>
    </ProgressBox>
  );
};

export default BehaviorProgressBar;
