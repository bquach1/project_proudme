import React, { useEffect, useState } from "react";

import { CSVLink } from "react-csv";
import { Button } from "@mui/material";
import axios from "axios";
import { DATABASE_URL } from "../../constants";

export const BehaviorTrackingCSV = ({ behaviorData, user }) => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchAllBehaviors = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/userByName`, {
          params: {
            name: user,
          },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllBehaviors();
  }, [user]);

  useEffect(() => {
    console.log(userInfo.length && userInfo);
  })

  const finalData = behaviorData.map((obj) => ({
    ...obj,
    gradeLevel: userInfo[0].gradeLevel,
    birthYear: userInfo[0].birthYear,
    birthMonth: userInfo[0].birthMonth,
    gender: userInfo[0].gender,
    schoolName: userInfo[0].schoolName,
    timeLogged: new Date(obj.dateToday).toLocaleTimeString(),
  }));

  const behaviorHeaders = [
    { label: "User", key: "name" },
    { label: "Grade Level", key: "gradeLevel" },
    { label: "Birth Year", key: "birthYear" },
    { label: "Birth Month", key: "birthMonth" },
    { label: "Gender", key: "gender" },
    { label: "School Name", key: "schoolName" },
    { label: "Date", key: "date" },
    { label: "Time Logged", key: "timeLogged" },
    { label: "Type of Goal", key: "goalType" },
    { label: "Goal Quantity", key: "goalValue" },
    { label: "Daily Value", key: "behaviorValue" },
    { label: "Goal Met?", key: "goalStatus" },
    { label: "Reflection", key: "reflection" },
  ];

  return (
    <div>
      <CSVLink
        data={finalData}
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
