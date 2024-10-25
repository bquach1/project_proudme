import React, { useEffect, useState } from "react";
import { Tooltip, TextField, Typography } from "@mui/material";

const DurationPicker = ({
  loggedGoalToday,
  editingBehaviorId,
  goalData,
  goal,
  setGoalData,
  editingId,
  type = null,
}) => {
  const [hours, setHours] = useState(
    type === "behavior"
      ? Math.floor(goal[0].behaviorValue / 60)
      : Math.floor(goal[0].goalValue / 60)
  );
  const [minutes, setMinutes] = useState(
    type === "behavior" ? goal[0].behaviorValue % 60 : goal[0].goalValue % 60
  );
  
  useEffect(() => {
    if (type === "behavior") {
      if (editingId === 3) {
        setHours(Math.floor(goal[0].behaviorValue));
      } else setHours(Math.floor(goal[0].behaviorValue / 60));
      if (editingId === 3) {
        setMinutes(Math.round((goal[0].behaviorValue % 1) * 60));
      } else setMinutes(goal[0].behaviorValue % 60);
    } else {
      if (editingId === 3) {
        setHours(Math.floor(goal[0].goalValue));
      } else setHours(Math.floor(goal[0].goalValue / 60));
      if (editingId === 3) {
        setMinutes(Math.round((goal[0].goalValue % 1) * 60));
      } else setMinutes(goal[0].goalValue % 60);
    }
  }, [goal, type]);

  const handleHoursChange = (e) => {
    const value = +e.target.value;

    setGoalData((prevGoal) => {
      const updatedGoal = prevGoal.map((goal) => {
        if (type !== "behavior") {
          if (editingId === 3) {
            return {
              ...goal,
              goalValue: value + minutes / 60,
            };
          } else
            return {
              ...goal,
              goalValue: value * 60 + minutes,
            };
        } else {
          if (editingId === 3) {
            return {
              ...goal,
              behaviorValue: value + minutes / 60,
            };
          } else
            return {
              ...goal,
              behaviorValue: value * 60 + minutes,
            };
        }
      });
      return updatedGoal;
    });
  };

  const handleMinutesChange = (e) => {
    const value = +e.target.value;

    setGoalData((prevGoal) => {
      const updatedGoal = prevGoal.map((goal) => {
        if (type !== "behavior") {
          if (editingId === 3) {
            return {
              ...goal,
              goalValue: hours + value / 60,
            };
          } else
            return {
              ...goal,
              goalValue: hours * 60 + value,
            };
        } else {
          if (editingId === 3) {
            return {
              ...goal,
              behaviorValue: hours + value / 60,
            };
          } else
            return {
              ...goal,
              behaviorValue: hours * 60 + value,
            };
        }
      });
      return updatedGoal;
    });
  };

  return (
    <>
      <Tooltip
        title={
          loggedGoalToday &&
          editingBehaviorId !== editingId &&
          type !== "behavior"
            ? "You've already logged this goal today! You can change it by clicking the edit button to the right."
            : loggedGoalToday &&
              editingBehaviorId !== editingId &&
              type === "behavior"
            ? "You've already logged this behavior today! You can change it by clicking the edit button to the right."
            : ""
        }
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            marginLeft: "5%",
          }}
        >
          <TextField
            className={
              loggedGoalToday && editingBehaviorId !== editingId
                ? "disabled-behavior"
                : loggedGoalToday &&
                  goalData.length &&
                  (goalData[0].goalValue - goal[0].goalValue !== 0 ||
                    goalData[0].behaviorValue - goal[0].behaviorValue !== 0 ||
                    goalData[0].reflection !== goal[0].reflection)
                ? "pending-behavior"
                : "behavior"
            }
            disabled={
              loggedGoalToday && editingBehaviorId !== editingId ? true : false
            }
            type="number"
            label="Hours"
            variant="outlined"
            value={hours}
            onChange={handleHoursChange}
            inputProps={{
              min: 0,
              max: 23,
              step: 1,
            }}
            style={{ width: "40%" }}
          />
          <Typography variant="h6">:</Typography>
          <TextField
            className={
              loggedGoalToday && editingBehaviorId !== editingId
                ? "disabled-behavior"
                : loggedGoalToday &&
                  goalData.length &&
                  (goalData[0].goalValue - goal[0].goalValue !== 0 ||
                    goalData[0].behaviorValue - goal[0].behaviorValue !== 0 ||
                    goalData[0].reflection !== goal[0].reflection)
                ? "pending-behavior"
                : "behavior"
            }
            disabled={
              loggedGoalToday && editingBehaviorId !== editingId ? true : false
            }
            style={{ width: "50%" }}
            type="number"
            label="Minutes"
            variant="outlined"
            value={minutes}
            onChange={handleMinutesChange}
            inputProps={{
              min: 0,
              max: 59,
              step: 1,
            }}
          />
        </div>
      </Tooltip>
    </>
  );
};

export default DurationPicker;
