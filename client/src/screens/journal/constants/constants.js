export const SAVE_ICON_COLORS = {
  RED: "#FF7377",
  GREEN: "#008000",
  YELLOW: "#DAC778",
};

export const generateSaveTooltipMessage = (
  goal,
  goalData,
  loggedGoalToday,
  goalType
) =>
  !goalData.length || !loggedGoalToday
    ? `Record your first ${goalType} goal for today!`
    : goalData[0].goalValue - goalData[0].goalValue === 0 &&
      goalData[0].behaviorValue - goal[0].behaviorValue === 0 &&
      goalData[0].reflection === goal[0].reflection
    ? `Today's ${goalType} goal is up to date!`
    : goalData[0].goalValue - goal[0].goalValue !== 0 ||
      goalData[0].behaviorValue - goal[0].behaviorValue !== 0 ||
      goalData[0].reflection !== goal[0].reflection
    ? `Save changes to today's ${goalType} goal`
    : `No ${goalType} Data found`;

export const MAX_FEEDBACK_LINES = 7;