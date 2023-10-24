// Not currently being used
import React from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  Label,
  YAxis,
  Tooltip,
  Bar,
  Legend,
  LabelList,
  Cell,
} from "recharts";

import { CustomTooltip } from "screens/tracking/components/customAuxiliary/CustomTooltip";
import { CustomLegend } from "screens/tracking/components/customAuxiliary/CustomLegend";

const BehaviorBarChart = ({ data, chartGoalType }) => {
  return (
    <BarChart
      width={1000}
      height={800}
      data={data}
      margin={{ top: 55, right: 80, left: 70, bottom: 70 }}
    >
      <CartesianGrid strokeDasharray="3 3" fill="white" />

      <XAxis dataKey="date">
        <Label value="Date" position="bottom" />
      </XAxis>

      <YAxis
        domain={[
          0,
          chartGoalType === "activity"
            ? 70
            : chartGoalType === "screentime"
            ? 130
            : chartGoalType === "eating"
            ? 6
            : 9,
        ]}
      >
        <Label
          value={chartGoalType === "eating" ? "servings/day" : "minutes/day"}
          position="insideLeft"
          offset={-70}
        />
      </YAxis>
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="recommendedValue" fill="green" stackId="stack" />
      <Bar dataKey="goalValue" fill="#A7C7E7" stackId="stack" />
      <Bar dataKey="behaviorValue" stackId="stack">
        <LabelList dataKey="behaviorValue" fill="white" />
        {data.map((entry, index) => (
          <Cell
            key={index}
            fill={
              chartGoalType === "screentime" &&
              entry.behaviorValue > entry.goalValue * 2
                ? "#FF6961"
                : chartGoalType === "screentime" &&
                  entry.behaviorValue > entry.goalValue
                ? "#FFC000"
                : chartGoalType === "screentime" &&
                  entry.behaviorValue < entry.goalValue
                ? "#77DD77"
                : entry.behaviorValue > entry.goalValue
                ? "#77DD77"
                : entry.behaviorValue === entry.goalValue
                ? "#8884d8"
                : entry.behaviorValue < entry.goalValue / 2
                ? "#FF6961"
                : "#FFC000"
            }
          />
        ))}
      </Bar>
      {/* <ReferenceLine
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
        /> */}
      <Legend wrapperStyle={{ paddingTop: 20 }} content={<CustomLegend />} />
    </BarChart>
  );
};

export default BehaviorBarChart;
