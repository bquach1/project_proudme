import React from "react";

import { CSVLink } from "react-csv";

export const GoalCSV = ({ allGoalData }) => {
  const headers = [
    { label: "_id", key: "_id" },
    { label: "User", key: "user" },
    { label: "Goal Details", key: "divInfo1" },
    { label: "Goal Description", key: "divInfo2" },
    { label: "Goal Quantity", key: "goalValue" },
    { label: "Daily Value", key: "behaviorValue" },
    { label: "Type of Goal", key: "goalType" },
    { label: "Date", key: "date" },
    { label: "Goal Reflection", key: "reflection" },
    { label: "Goal Met?", key: "goalStatus" },
    { label: "__v", key: "__v" },
  ];

  return (
    <div>
      {allGoalData && (
        <CSVLink data={allGoalData} headers={headers} filename="goaldata.csv">
          <img
            className="achievements-tab"
            src={require("../../components/images/journal/achievements_tab.png")}
            alt="Achievements bookmark tab"
          />
        </CSVLink>
      )}
    </div>
  );
};

export const BehaviorTrackingCSV = ({ allBehaviorData }) => {
  const behaviorHeaders = [
    { label: "User", key: "user" },
    { label: "Type of Goal", key: "goalType" },
    { label: "Goal Quantity", key: "goalValue" },
    { label: "Date", key: "date" },
    { label: "Daily Value", key: "behaviorValue" },
    { label: "Goal Met?", key: "goalStatus" },
  ];

  return (
    <div>
      <CSVLink
        data={allBehaviorData}
        headers={behaviorHeaders}
        filename="behaviordata.csv"
      >
        <img
          className="gallery-tab"
          src={require("../../components/images/journal/gallery_tab.png")}
          alt="Achievements bookmark tab"
        />
      </CSVLink>
    </div>
  );
};
