import React, { useEffect, useState } from "react";

import { CSVLink } from "react-csv";
import { Button } from "@mui/material";
import axios from "axios";
import { DATABASE_URL } from "constants";

export const BehaviorTrackingCSV = ({
  behaviorData,
  allBehaviorData,
  user,
}) => {
  const [inputData, setInputData] = useState([]);
  const [allInputData, setAllInputData] = useState([]);

  allBehaviorData.sort((a, b) => {
    if (a.user < b.user) return -1;
    if (a.user > b.user) return 1;
    return 0;
  });

  useEffect(() => {
    const fetchAllBehaviors = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/userByName`, {
          params: {
            name: user,
          },
        });

        const finalData = behaviorData.map((obj) => ({
          ...obj,
          gradeLevel: response.data[0].gradeLevel,
          birthYear: response.data[0].birthYear,
          birthMonth: response.data[0].birthMonth,
          gender: response.data[0].gender,
          schoolName: response.data[0].schoolName,
          timeLogged: new Date(obj.dateToday).toLocaleTimeString(),
        }));

        setInputData(finalData);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAllUserBehaviors = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/allUsers`, {});

        const finalData = allBehaviorData.map((obj) => ({
          ...obj,
          gradeLevel: response.data[0].gradeLevel,
          birthYear: response.data[0].birthYear,
          birthMonth: response.data[0].birthMonth,
          gender: response.data[0].gender,
          schoolName: response.data[0].schoolName,
          timeLogged: new Date(obj.dateToday).toLocaleTimeString(),
        }));

        setAllInputData(finalData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllBehaviors();
    fetchAllUserBehaviors();
  }, [user, behaviorData, allBehaviorData]);

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
    { label: "Recommended Level", key: "recommendedValue" },
    { label: "Goal Met?", key: "goalStatus" },
    { label: "Reflection", key: "reflection" },
    { label: "AI Feedback", key: "feedback" },
  ];

  return (
    <div>
      <CSVLink
        data={inputData}
        headers={behaviorHeaders}
        filename={`${user}_behaviordata.csv`}
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
      <CSVLink
        data={allInputData}
        headers={behaviorHeaders}
        filename={`allbehaviordata.csv`}
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
          Download all Behavior Data
        </Button>
      </CSVLink>
    </div>
  );
};
