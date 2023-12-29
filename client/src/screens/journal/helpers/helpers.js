import { SAVE_ICON_COLORS } from "screens/journal/constants/constants";
import axios from "axios";
import { DATABASE_URL } from "constants";

export const getSaveButtonColor = (loggedGoalToday, goalData, goal) => {
  if (
    loggedGoalToday &&
    goalData.length &&
    (goalData[0].goalValue - goal[0].goalValue !== 0 ||
      goalData[0].behaviorValue - goal[0].behaviorValue !== 0 ||
      goalData[0].reflection !== goal[0].reflection)
  ) {
    return SAVE_ICON_COLORS.YELLOW;
  } else if (!goalData.length || !loggedGoalToday) {
    return SAVE_ICON_COLORS.GREEN;
  } else if (
    goalData[0].goalValue - goal[0].goalValue === 0 &&
    goalData[0].behaviorValue - goal[0].behaviorValue === 0 &&
    goalData[0].reflection === goal[0].reflection
  ) {
    return SAVE_ICON_COLORS.RED;
  } else {
    return "auto";
  }
};

export const createChatbotRequest = (
  goal,
  setGoal,
  user,
  date,
  setGoalResponseLoading
) => {
  setGoalResponseLoading(true);
  axios
    .post(`${DATABASE_URL}/chatbot`, {
      prompt: [
        {
          role: "system",
          content:
            goal[0].goalType === "screentime" &&
            goal[0].goalValue === 0 &&
            goal[0].behaviorValue === 0
              ? "category6"
              : goal[0].goalType === "screentime" && goal[0].behaviorValue === 0
              ? "category7"
              : goal[0].goalType === "screentime" && goal[0].goalValue === 0
              ? "category8"
              : goal[0].goalType === "screentime" &&
                goal[0].behaviorValue > goal[0].goalValue * 2
              ? "category1"
              : goal[0].goalType === "screentime" &&
                goal[0].behaviorValue > goal[0].goalValue
              ? "category2"
              : goal[0].goalType === "screentime" &&
                goal[0].behaviorValue <= goal[0].goalValue &&
                goal[0].behaviorValue > goal[0].recommendedValue
              ? "category3"
              : goal[0].goalType === "screentime" &&
                goal[0].behaviorValue <= goal[0].goalValue &&
                goal[0].behaviorValue * 2 >= goal[0].goalValue &&
                goal[0].goalValue <= goal[0].recommendedValue
              ? "category4"
              : goal[0].goalType === "screentime" &&
                goal[0].behaviorValue * 2 <= goal[0].goalValue &&
                goal[0].goalValue <= goal[0].recommendedValue
              ? "category5"
              : goal[0].goalType === "screentime"
              ? "category9"
              : `Health goal type: ${goal[0].goalType}, Recommended value: ${
                  goal[0].recommendedValue
                }, Actual Goal Value: ${goal[0].goalValue}, ' \
f'Actual behavior value achieved: ${
                  goal[0].behaviorValue
                }, percentage of actual goal achieved: ${`${
                  (parseFloat(goal[0].behaviorValue).toFixed(2) /
                    parseFloat(goal[0].goalValue).toFixed(2)) *
                  100
                }%`}, ' \
f'percentage of recommended goal achieved: ${`${
                  (parseFloat(goal[0].behaviorValue).toFixed(2) /
                    parseFloat(goal[0].recommendedValue).toFixed(2)) *
                  100
                }%`}, Reflection: ${goal[0].reflection}.`,
        },
      ],
    })
    .then((response) => {
      setGoal((prevGoal) => {
        const updatedGoal = prevGoal.map((goal) => {
          const newFeedback = {
            ...goal,
            feedback: response.data.chat_reply,
          };
          return newFeedback;
        });
        return updatedGoal;
      });
      axios.post(`${DATABASE_URL}/behaviors`, {
        user: user._id,
        name: user.name,
        goalType: goal[0].goalType,
        date: date,
        feedback: response.data.chat_reply,
      });
      setGoalResponseLoading(false);
    });
};

export async function updateBehaviorValue(
  user,
  newGoalValue,
  newBehaviorValue,
  newReflection,
  setGoal,
  currentGoal,
  goalData,
  goalType,
  date,
  recommendedValue
) {
  setGoal((prevGoal) => {
    const updatedBehaviorGoal = prevGoal.map((goal) => {
      const updatedGoal = { ...goal, behaviorValue: +newBehaviorValue };
      axios
        .post(`${DATABASE_URL}/goals`, {
          user: user._id,
          name: user.name,
          goalType: goalType,
          goalValue: +newGoalValue,
          behaviorValue: newBehaviorValue,
          goalStatus: goalData.length
            ? newBehaviorValue > goalData[0].goalValue &&
              goalType === "screentime"
              ? "no"
              : newBehaviorValue >= goalData[0].goalValue &&
                goalType !== "screentime"
              ? "yes"
              : "no"
            : newBehaviorValue > currentGoal[0].goalValue &&
              goalType === "screentime"
            ? "no"
            : newBehaviorValue >= currentGoal[0].goalValue &&
              goalType !== "screentime"
            ? "yes"
            : "no",
          reflection: newReflection,
          dateToday: new Date(),
          recommendedValue: recommendedValue,
        })
        .catch((error) => {
          console.error(error);
        });
      axios
        .post(`${DATABASE_URL}/behaviors`, {
          user: user._id,
          name: user.name,
          goalType: goalType,
          date: date,
          dateToday: new Date(),
          goalValue: +newGoalValue,
          behaviorValue: newBehaviorValue,
          goalStatus: goalData.length
            ? newBehaviorValue > goalData[0].goalValue &&
              goalType === "screentime"
              ? "no"
              : newBehaviorValue >= goalData[0].goalValue &&
                goalType !== "screentime"
              ? "yes"
              : "no"
            : newBehaviorValue > currentGoal[0].goalValue &&
              goalType === "screentime"
            ? "no"
            : newBehaviorValue >= currentGoal[0].goalValue &&
              goalType !== "screentime"
            ? "yes"
            : "no",
          divInfo1: currentGoal[0].divInfo1,
          divInfo2: currentGoal[0].divInfo2,
          reflection: newReflection,
          recommendedValue: recommendedValue,
          feedback: currentGoal[0].feedback,
        })
        .catch((error) => {
          console.error(error);
        });
      return updatedGoal;
    });
    return updatedBehaviorGoal;
  });
}
