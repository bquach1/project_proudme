import React from "react";
import { Box, LinearProgress, Tooltip } from "@mui/material";
import styled from "styled-components";
import { BEHAVIOR_COLORS } from "constants";
import { useMediaQuery } from "react-responsive";

const ProgressBox = styled(Box)``;

const ProgressBar = styled.div``;

const BehaviorProgressBar = ({ data, chartGoalType, type }) => {
  const totalBehaviorValue = data.reduce(
    (total, entry) => total + entry.behaviorValue,
    0
  );
  const totalRecommendedValue = data.reduce(
    (total, entry) => total + entry.recommendedValue,
    0
  );
  const totalGoalValue = data.reduce(
    (total, entry) => total + entry.goalValue,
    0
  );

  console.log(totalGoalValue);

  const isSmallMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 800px)" });

  const overallProgress = (totalBehaviorValue / Math.max(totalGoalValue, totalRecommendedValue)) * 100;

  const goalProgress = (totalGoalValue / totalRecommendedValue) * 100;

  const averageBehaviorVal = totalBehaviorValue / data.length;

  return (
    <ProgressBox
      sx={{
        width: "80%",
        marginBottom: isMobile || isSmallMobile ? "20%" : "5%",
      }}
      position="relative"
    >
      {type === "goal" ? (
        <ProgressBar
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%" }}>
            <Tooltip title={"Total Recommended Value"}>
              <div
                style={{
                  content: '""',
                  position: "absolute",
                  width: "5px",
                  background:
                    (goalProgress > 100 && chartGoalType !== "screentime") ||
                    (goalProgress < 100 && chartGoalType === "screentime")
                      ? BEHAVIOR_COLORS.GREEN
                      : goalProgress === 100
                      ? BEHAVIOR_COLORS.PURPLE
                      : BEHAVIOR_COLORS.RED,
                  top: 0,
                  bottom: 0,
                  zIndex: 1,
                  left:
                    goalProgress > 100
                      ? `calc(${
                          (totalRecommendedValue / totalGoalValue) * 100
                        }% - 6px)`
                      : `calc(${
                          (totalGoalValue / totalRecommendedValue) * 100
                        }% - 6px)`,
                }}
              />
            </Tooltip>
            <LinearProgress
              variant="determinate"
              value={Math.min(goalProgress, 100)}
              style={{ height: 50, borderRadius: 10, flex: 1, margin: 10 }}
              sx={{
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#8884d8",
                },
              }}
            />
            <div
              style={{
                width: "50%",
                margin: "0 auto",
                position: "absolute",
                right: "25%",
              }}
            >
              <div>{"Total Goal Value: " + totalGoalValue}</div>
              <div>{"Total Recommended Value: " + totalRecommendedValue}</div>
            </div>
          </div>
        </ProgressBar>
      ) : (
        <ProgressBar
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(overallProgress, 100)}
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
            <div style={{ width: "10%", position: "absolute", right: 0 }}>
              {+parseFloat(totalBehaviorValue).toFixed(2)} /{" "}
              {Math.max(totalRecommendedValue, totalGoalValue)}
            </div>
            <div style={{ width: "20%", position: "absolute", left: 0 }}>
              Number of Days Logged:&nbsp;
              {data.length}
            </div>
            <div style={{ width: "20%", position: "absolute", left: "40%" }}>
              Average Behavior Value:&nbsp;
              {+parseFloat(averageBehaviorVal).toFixed(2)}
            </div>
          </div>
        </ProgressBar>
      )}
    </ProgressBox>
  );
};

export default BehaviorProgressBar;
