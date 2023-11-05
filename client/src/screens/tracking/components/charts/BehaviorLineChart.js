import React, { useEffect } from "react";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  Label,
  YAxis,
  Tooltip,
  Line,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

import { CustomTooltip } from "screens/tracking/components/customAuxiliary/CustomTooltip";
import { CustomLegend } from "screens/tracking/components/customAuxiliary/CustomLegend";

import styled from "styled-components";

const CurrentLineChart = styled(LineChart)`
  .bold-label {
    font-weight: bold;
    font-size: 20px;
  }
`;

const BehaviorLineChart = ({ data, chartGoalType, lineChartView }) => {
  const maxBehaviorVal =
    data &&
    data.reduce((max, current) => {
      return max > current.behaviorValue ? max : current.behaviorValue;
    }, data.length && data[0].behaviorValue);

  return (
    <ResponsiveContainer width={"100%"} height={750}>
      <CurrentLineChart
        width={1350}
        height={750}
        data={data}
        margin={{ top: 30, right: 120, left: 120, bottom: 70 }}
      >
        <CartesianGrid strokeDasharray="3 3" fill="white" />

        <XAxis dataKey="date" className="bold-label">
          <Label value="Date" position="bottom" />
        </XAxis>

        <YAxis
          domain={[
            0,
            chartGoalType === "activity" && maxBehaviorVal < 60
              ? 60
              : chartGoalType === "activity"
              ? Math.min(600, maxBehaviorVal)
              : chartGoalType === "screentime" && maxBehaviorVal < 120
              ? 120
              : chartGoalType === "screentime"
              ? Math.min(960, maxBehaviorVal)
              : chartGoalType === "eating" && maxBehaviorVal < 5
              ? 5
              : chartGoalType === "eating"
              ? Math.min(20, maxBehaviorVal)
              : chartGoalType === "sleep" && maxBehaviorVal < 9
              ? 9
              : Math.min(15, maxBehaviorVal),
          ]}
          allowDataOverflow={true}
          className="bold-label"
          tickFormatter={(value) => (value % 1 !== 0 ? value.toFixed(2) : value)}
        >
          <Label
            value={
              chartGoalType === "eating"
                ? "servings/day"
                : chartGoalType === "sleep"
                ? "hours/day"
                : "minutes/day"
            }
            position="left"
            dx={5}
            className="custom-label"
          />
        </YAxis>

        <Tooltip content={<CustomTooltip />} />
        <Line
          type="linear"
          dataKey="goalValue"
          connectNulls={true}
          stroke="#A7C7E7"
          strokeWidth={5}
          activeDot={{ r: 6 }}
          style={lineChartView === "behaviorOnly" ? { display: "none" } : {}}
        />

        <defs>
          <linearGradient
            id={`colorUv${chartGoalType}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            {data.map((entry, index) => {
              const colorOffset = (index / (data.length - 1)) * 100;
              const stopColor =
                chartGoalType === "screentime" &&
                entry.behaviorValue > entry.recommendedValue * 2
                  ? "#FF6961"
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
                  : "#FFC000";

              return (
                <stop
                  key={index}
                  offset={`${colorOffset}%`}
                  stopColor={stopColor}
                />
              );
            })}
          </linearGradient>
        </defs>

        {lineChartView !== "goalOnly" && (
          <Line
            type="linear"
            dataKey="behaviorValue"
            connectNulls={true}
            stroke={`url(#colorUv${chartGoalType})`}
            strokeWidth={5}
            activeDot={{ r: 6 }}
          />
        )}
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ paddingLeft: 20 }}
          content={<CustomLegend />}
        />
        <ReferenceLine
          y={
            chartGoalType === "activity"
              ? 60
              : chartGoalType === "screentime"
              ? 120
              : chartGoalType === "eating"
              ? 5
              : 9
          }
          label={{
            value: "Recommended Level",
            className: "tracking-reference",
            fill: "black",
            position: "top",
          }}
          stroke="green"
          strokeWidth={2}
        />
      </CurrentLineChart>
    </ResponsiveContainer>
  );
};

export default BehaviorLineChart;
