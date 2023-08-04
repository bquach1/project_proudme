import React from "react";

import { CSVLink } from "react-csv";
import { Button } from "@mui/material";

export const GoalCSV = ({ goalData, user }) => {
  const headers = [
    { label: "User", key: "name" },
    { label: "Type of Goal", key: "goalType" },
    { label: "Goal Quantity", key: "goalValue" },
    { label: "Daily Value", key: "behaviorValue" },
    { label: "Last Logged Date", key: "date" },
    { label: "Goal Details", key: "divInfo1" },
    { label: "Goal Description", key: "divInfo2" },
    { label: "Goal Reflection", key: "reflection" },
    { label: "Goal Met?", key: "goalStatus" },
  ];

  return (
    <div>
      {goalData && (
        <CSVLink data={goalData} headers={headers} filename="goaldata.csv">
          <Button
            style={{
              textTransform: "none",
              backgroundColor: "#8054C9",
              color: "white",
              borderRadius: 10,
              padding: "5px 10px 5px 10px",
              margin: 10,
            }}
          >
            Download {user}'s Goal Data
          </Button>
        </CSVLink>
      )}
    </div>
  );
};

export const BehaviorTrackingCSV = ({ allBehaviorData, user }) => {
  const behaviorHeaders = [
    { label: "User", key: "name" },
    { label: "Date", key: "date" },
    { label: "Type of Goal", key: "goalType" },
    { label: "Goal Quantity", key: "goalValue" },
    { label: "Daily Value", key: "behaviorValue" },
    { label: "Goal Met?", key: "goalStatus" },
    { label: "Reflection", key: "reflection"},
    { label: "Goal Details", key: "divInfo1" },
    { label: "Goal Description", key: "divInfo2" },
  ];

  return (
    <div>
      <CSVLink
        data={allBehaviorData}
        headers={behaviorHeaders}
        filename={`behaviordata.csv`}
      >
        <Button
          style={{
            textTransform: "none",
            backgroundColor: "#8054C9",
            color: "white",
            borderRadius: 10,
            padding: "5px 10px 5px 10px",
            margin: 10,
          }}
        >
          Download {user}'s Behavior Data
        </Button>
      </CSVLink>
    </div>
  );
};
