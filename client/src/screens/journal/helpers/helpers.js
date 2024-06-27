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

export const createChatbotRequest = (goal, setGoal, user, date, setGoalResponseLoading) => {
  setGoalResponseLoading(true);

  const goalType = goal[0].goalType;
  const behaviorValue = goal[0].behaviorValue;
  const reflection = goal[0].reflection || "None";

  let additionalInfo = "";

  if (goalType === "eating") {
    additionalInfo = `Servings: ${goal[0].behaviorValue}`;
  } else if (goalType === "sleep") {
    additionalInfo = `Hours of sleep: ${goal[0].behaviorValue}`;
  } else if (goalType === "activity" || goalType === "screentime") {
    additionalInfo = `Activities: ${goal[0].activities ? goal[0].activities.join(", ") : "None"}`;
  }

  axios
    .post(`${DATABASE_URL}/chatbot`, {
      prompt: [
        {
          role: "system",
          content: `Goal Type: ${goalType}, 
                    Recommended Value: ${goal[0].recommendedValue}, 
                    Actual Value: ${behaviorValue}, 
                    ${additionalInfo}, 
                    Reflection: ${reflection}`,
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
        goalType: goalType,
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
  recommendedValue,
  activities = {},
  servings = { fruits: 0, vegetables: 0 },
  sleep = { bedGoal: 0, wakeUpGoal: 0, bedBehavior: 0, wakeUpBehavior: 0 }
) {
  setGoal((prevGoal) => {
    const updatedBehaviorGoal = prevGoal.map((goal) => {
      const updatedGoal = {
        ...goal,
        behaviorValue: +newBehaviorValue,
        activities,
        servings,
        sleep,
      };

      axios
        .post(`${DATABASE_URL}/goals`, {
          user: user._id,
          name: user.name,
          goalType: goalType,
          goalValue: +newGoalValue,
          behaviorValue: newBehaviorValue,
          activities,
          servings,
          sleep,
          goalStatus:
            goalData.length && goalType !== "screentime"
              ? newBehaviorValue >= goalData[0].goalValue
                ? "yes"
                : "no"
              : goalType === "screentime"
              ? newBehaviorValue > goalData[0].goalValue
                ? "no"
                : "yes"
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
          activities,
          servings,
          sleep,
          goalStatus:
            goalData.length && goalType !== "screentime"
              ? newBehaviorValue >= goalData[0].goalValue
                ? "yes"
                : "no"
              : goalType === "screentime"
              ? newBehaviorValue > goalData[0].goalValue
                ? "no"
                : "yes"
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
