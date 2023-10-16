import React from "react";
import { Box, LinearProgress } from "@mui/material";

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
    <Box sx={{ width: "80%" }} position="relative">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LinearProgress
          variant="determinate"
          value={overallProgress > 100 ? 100 : overallProgress}
          style={{ height: 50, borderRadius: 10, flex: 1, margin: 10 }}
          sx={{
            "& .MuiLinearProgress-bar": {
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
      </div>
    </Box>
  );
};

export default BehaviorProgressBar;
