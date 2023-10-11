import React from "react";
import { Box, LinearProgress } from "@mui/material";

const BehaviorProgressBar = ({ data, chartGoalType }) => {
  return (
    <Box sx={{ width: "80%" }} position="relative">
      {data.map((entry) => {
        return (
          <div
            style={{
              display: "flex",
              margin: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "10%" }}>{entry.date}</div>
            <LinearProgress
              variant="determinate"
              value={
                (entry.behaviorValue / entry.recommendedValue) * 100 > 100
                  ? 100
                  : (entry.behaviorValue / entry.recommendedValue) * 100
              }
              style={{ height: 50, borderRadius: 10, flex: 1, margin: 10 }}
              sx={{
                "& .MuiLinearProgress-bar": {
                  backgroundColor:
                    chartGoalType === "screentime" &&
                    entry.behaviorValue > entry.recommendedValue * 2
                      ? "#FF6961"
                      : chartGoalType === "screentime" &&
                        entry.behaviorValue === entry.recommendedValue
                      ? "#8884d8"
                      : chartGoalType === "screentime" &&
                        entry.behaviorValue > entry.recommendedValue
                      ? "#FFC000"
                      : chartGoalType === "screentime" &&
                        entry.behaviorValue < entry.recommendedValue
                      ? "#77DD77"
                      : entry.behaviorValue > entry.recommendedValue
                      ? "#77DD77"
                      : entry.behaviorValue === entry.recommendedValue
                      ? "#8884d8"
                      : entry.behaviorValue < entry.recommendedValue / 2
                      ? "#FF6961"
                      : "#FFC000",
                },
              }}
            />
            <div style={{ width: "10%" }}>
              {entry.behaviorValue} / {entry.recommendedValue}
            </div>
          </div>
        );
      })}
    </Box>
  );
};

export default BehaviorProgressBar;
