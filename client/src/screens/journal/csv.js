import React from "react";

import { CSVLink } from "react-csv";
import { Button } from "@mui/material";

export const BehaviorTrackingCSV = ({ behaviorData, user, userData }) => {

  const behaviorHeaders = [
    { label: "User", key: "name" },
    { label: "Date", key: "date" },
    { label: "Type of Goal", key: "goalType" },
    { label: "Goal Quantity", key: "goalValue" },
    { label: "Daily Value", key: "behaviorValue" },
    { label: "Goal Met?", key: "goalStatus" },
    { label: "Reflection", key: "reflection" },
  ];

  return (
    <div>
      <CSVLink
        data={behaviorData}
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
