import React, { useState } from 'react';
import { Tooltip, TextField, Grid, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const DurationPicker = ({
  loggedActivityToday,
  editingBehaviorId,
  activityData,
  activityGoal,
  setActivityGoal,
}) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(
    activityGoal.length && activityGoal[0].goalValue
  );

  const handleHoursChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setHours(Math.max(0, Math.min(23, parseInt(value, 10))));
    }
  };

  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setMinutes(Math.max(0, Math.min(59, parseInt(value, 10))));
    }
  };

  const handleBlur = () => {
    // You can include any additional logic here to handle the state updates.
    // For example, if you need to update activityGoal, you can do it here.
    setActivityGoal((prevActivityGoal) => {
      const updatedActivityGoal = prevActivityGoal.map((goal) => {
        return {
          ...goal,
          goalValue: hours * 60 + minutes,
        };
      });
      return updatedActivityGoal;
    });
  };

  return (
    <Tooltip
      title={
        loggedActivityToday && editingBehaviorId !== 0
          ? "You've already logged this goal today! You can change it by clicking the edit button to the right."
          : ""
      }
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <AccessTimeIcon style={{width: "80%"}}/>
        </Grid>
        <Grid item>
          <TextField
            type="number"
            label="Hours"
            variant="outlined"
            value={hours}
            onChange={handleHoursChange}
            onBlur={handleBlur}
            inputProps={{
              min: 0,
              max: 23,
              step: 1,
            }}
            style={{width:"80%"}}
          />
        </Grid>
        <Grid item>
          <Typography variant="h6">:</Typography>
        </Grid>
        <Grid item>
          <TextField
            type="number"
            label="Minutes"
            variant="outlined"
            value={minutes}
            onChange={handleMinutesChange}
            onBlur={handleBlur}
            inputProps={{
              min: 0,
              max: 59,
              step: 1,
            }}
          />
        </Grid>
      </Grid>
    </Tooltip>
  );
};

export default DurationPicker;
