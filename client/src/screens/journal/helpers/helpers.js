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
  setGoalResponseLoading,
  selectedItems = {},
  goalInputs = {},
  behaviorInputs = {},
  totalExpectedTime = {},
  totalTrackedTime = {}
) => {
  setGoalResponseLoading(true);

  const goalType = goal[0].goalType;
  const reflection = goal[0].reflection || "None";
  let additionalInfo = "";
  let goalMet = false;

  if (!goalInputs || Object.keys(goalInputs).length === 0 || !selectedItems || Object.keys(selectedItems).length === 0) {
    console.error("No goal or selected items found. Ensure the user has selected items in the popups.");
    setGoalResponseLoading(false);
    return;
  }

  if (goalType === "activity") {
    const activities = selectedItems?.activity || [];
    additionalInfo = `Activities: ${activities.map(item =>
      `${item}: Expected ${goalInputs?.activity?.[item]?.hours || 0}h ${goalInputs?.activity?.[item]?.minutes || 0}m, 
      Tracked ${behaviorInputs?.activity?.[item]?.hours || 0}h ${behaviorInputs?.activity?.[item]?.minutes || 0}m`
    ).join(", ")}`;
    goalMet = totalTrackedTime?.activity >= 60;
  }
  else if (goalType === "screentime") {
    const screentimeActivities = selectedItems?.screentime || [];

    additionalInfo = `Screentime Activities: ${screentimeActivities.map(item =>
      `${item}: Expected ${goalInputs?.screentime?.[item]?.hours || 0}h ${goalInputs?.screentime?.[item]?.minutes || 0}m, 
      Tracked ${behaviorInputs?.screentime?.[item]?.hours || 0}h ${behaviorInputs?.screentime?.[item]?.minutes || 0}m`
    ).join(", ")}`;


    const schoolWorkRelated = screentimeActivities.some(item => item.toLowerCase().includes("school") || item.toLowerCase().includes("work"));

    if (schoolWorkRelated) {
      goalMet = true; // Screentime is acceptable if related to school/work
    } else {
      goalMet = totalTrackedTime?.screentime <= 120; // Exceeding 120 minutes for non-school/work screentime is not recommended
    }
  }

  else if (goalType === "eating") {
    const eatingItems = selectedItems?.eating || [];

    additionalInfo = `Eating Activities: ${eatingItems.map(item =>
      `${item}: Expected ${goalInputs?.eating?.[item]?.servings || 0} servings, 
      Tracked ${behaviorInputs?.eating?.[item]?.servings || 0} servings`
    ).join(", ")}`;
    goalMet = totalTrackedTime?.eating >= 5; // Target for eating is 5 servings
  }
  else if (goalType === "sleep") {
    const bedTime = goalInputs?.sleep?.["Expected Sleep"]?.bedTime || "";
    const wakeUpTime = goalInputs?.sleep?.["Expected Sleep"]?.wakeUpTime || "";
    const trackedBedTime = behaviorInputs?.sleep?.["Actual Sleep"]?.bedTime || "";
    const trackedWakeUpTime = behaviorInputs?.sleep?.["Actual Sleep"]?.wakeUpTime || "";

    additionalInfo = `Expected Sleep: Bed Time - ${bedTime}, Wake Up Time - ${wakeUpTime}, 
      Tracked Sleep: Bed Time - ${trackedBedTime}, Wake Up Time - ${trackedWakeUpTime}`;


    const totalSleepTime = calculateSleepDuration(trackedBedTime, trackedWakeUpTime);
    goalMet = totalTrackedTime?.sleep >= (9 * 60);
  }


  axios
    .post(`${DATABASE_URL}/chatbot`, {
      prompt: [
        {
          role: "system",
          content: `Provide feedback based on the user's actual behavior compared to their set goals.`,
        },
        {
          role: "user",
          content: `Goal Type: ${goalType}, Recommended Value: ${goal[0].recommendedValue} in appropriate units, Actual Value: ${totalTrackedTime[goalType] || 0} in appropriate units, ${additionalInfo}, Reflection: ${reflection}, Goal Met: ${goalMet ? "Yes" : "No"}`,
        },
      ],
    })
    .then((response) => {
      console.log(`Chatbot response for ${goalType}:`, response.data.chat_reply);
      setGoal((prevGoal) => {
        const updatedGoal = prevGoal.map((g) => ({
          ...g,
          feedback: response.data.chat_reply,
        }));
        return updatedGoal;
      });
      setGoalResponseLoading(false);
    })
    .catch((error) => {
      console.error(error);
      setGoalResponseLoading(false);
    });
};

const calculateSleepDuration = (bedTime, wakeUpTime) => {
  if (!bedTime || !wakeUpTime) return "";

  const [bedHour, bedMinute] = bedTime.split(":").map(Number);
  const [wakeHour, wakeMinute] = wakeUpTime.split(":").map(Number);

  const bedDate = new Date();
  bedDate.setHours(bedHour, bedMinute);

  const wakeDate = new Date();
  wakeDate.setHours(wakeHour, wakeMinute);

  if (wakeDate < bedDate) {
    wakeDate.setDate(wakeDate.getDate() + 1);
  }

  const sleepDurationInMinutes = (wakeDate - bedDate) / (1000 * 60);
  const hours = Math.floor(sleepDurationInMinutes / 60);
  const minutes = sleepDurationInMinutes % 60;

  return `${hours} hours and ${minutes} minutes`;
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
