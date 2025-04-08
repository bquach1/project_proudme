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

export const createChatbotRequest = async (
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
  let recommendedValue = "";
  let goalValue = "";
  let personalGoalMet = false;
  let actualValue = ""; 
  let selectedItem = "";

  let activityGoalMinutes = 0;
  let screentimeGoalMinutes = 0;
  let eatingGoalServings = 0;
  let sleepGoal = { hours: 0, minutes: 0 };

  let activityBehaviorMinutes = 0;
  let screentimeBehaviorMinutes = 0;
  let eatingBehaviorServings = 0;
  let sleepBehavior = { hours: 0, minutes: 0 };

  if (!goalInputs || Object.keys(goalInputs).length === 0 || !selectedItems || Object.keys(selectedItems).length === 0) {
    console.error("No goal or selected items found. Ensure the user has selected items in the popups.");
    setGoalResponseLoading(false);
    return;
  }

  // Helper function to calculate time (hours and minutes) for tracking
  const formatTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatGoalValue = (goalValue) => {
    if (typeof goalValue === 'object' && !Array.isArray(goalValue)) {
      return Object.entries(goalValue)
        .map(([key, value]) => {
          // Handle nested structures with hours and minutes
          if (typeof value === 'object') {
            const hours = value.hours || 0;
            const minutes = value.minutes || 0;
            const servings = value.servings || 0;
            const bedtime = value.bedtime || '';
            const wakeUpTime = value.wakeUpTime || '';
  
            // Format for bedtime and wake-up time
            if (bedtime && wakeUpTime) {
              return `${key}: Bedtime ${bedtime}, Wake-up Time ${wakeUpTime}`;
            }
  
            // Format for hours and minutes
            if (hours || minutes) {
              return `${key}: ${hours} hours ${minutes} minutes`;
            }
  
            // Format for servings
            if (servings) {
              return `${key}: ${servings} serving${servings > 1 ? 's' : ''}`;
            }
          }
  
          // Handle single key-value pair directly (fallback)
          return `${key}: ${value}`;
        })
        .join(', ');
    } else if (typeof goalValue === 'number') {
      // Handle single numeric values (e.g., total screentime)
      const hours = Math.floor(goalValue / 60);
      const minutes = goalValue % 60;
      return `${hours} hours ${minutes} minutes`;
    } else {
      // Fallback for unsupported formats
      return `Invalid goal value format`;
    }
  };
  
  const calculateQuantities = (goalInputs, behaviorInputs) => {
    activityGoalMinutes = Object.values(goalInputs.activity).reduce(
      (total, { hours = 0, minutes = 0 }) =>
        total + parseInt(hours, 10) * 60 + parseInt(minutes, 10),
      0
    );
  
    screentimeGoalMinutes = Object.values(goalInputs.screentime).reduce(
      (total, { hours = 0, minutes = 0 }) =>
        total + parseInt(hours, 10) * 60 + parseInt(minutes, 10),
      0
    );
  
    eatingGoalServings = Object.values(goalInputs.eating).reduce(
      (total, { servings = 0 }) => total + parseInt(servings, 10),
      0
    );

    

  
    if (goalInputs.sleep["Expected Sleep"]) {
      const { bedtime, wakeUpTime } = goalInputs.sleep["Expected Sleep"];
      const [bedHour, bedMinute] = bedtime.split(":").map(Number);
      const [wakeHour, wakeMinute] = wakeUpTime.split(":").map(Number);
      const bedMinutes = bedHour * 60 + bedMinute;
      const wakeMinutes = wakeHour * 60 + wakeMinute;
      const totalMinutes =
        wakeMinutes > bedMinutes
          ? wakeMinutes - bedMinutes
          : 1440 - bedMinutes + wakeMinutes;
  
      sleepGoal = {
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60,
      };
    }
    setGoal((prevGoal) => {
      const updatedGoal = prevGoal.map((g) => {
        console.log("Current goal type:", g.goalType); // Log to verify goalType
        return {
          ...g,
          goalValue:
            g.goalType === "activity"
              ? activityGoalMinutes
              : g.goalType === "screentime"
              ? screentimeGoalMinutes
              : g.goalType === "eating"
              ? eatingGoalServings
              : g.goalType === "sleep"
              ? `${sleepGoal.hours} hours ${sleepGoal.minutes} minutes`
              : g.goalValue, // Fallback
        };
      });
      console.log("Updated goal:", updatedGoal); // Log updated goals
      return updatedGoal;
    });

    activityBehaviorMinutes = Object.values(behaviorInputs.activity).reduce(
      (total, { hours = 0, minutes = 0 }) =>
          total + parseInt(hours, 10) * 60 + parseInt(minutes, 10),
      0
    );
    
    screentimeBehaviorMinutes = Object.values(behaviorInputs.screentime).reduce(
        (total, { hours = 0, minutes = 0 }) =>
            total + parseInt(hours, 10) * 60 + parseInt(minutes, 10),
        0
    );
    
    eatingBehaviorServings = Object.values(behaviorInputs.eating).reduce(
        (total, { servings = 0 }) =>
            total + parseInt(servings, 10),
        0
    );

  
  
  
    if (behaviorInputs.sleep["Actual Sleep"]) {
      const { bedtime, wakeUpTime } = behaviorInputs.sleep["Actual Sleep"];
      const [bedHour, bedMinute] = bedtime.split(":").map(Number);
      const [wakeHour, wakeMinute] = wakeUpTime.split(":").map(Number);
      const bedMinutes = bedHour * 60 + bedMinute;
      const wakeMinutes = wakeHour * 60 + wakeMinute;
      const totalMinutes =
        wakeMinutes > bedMinutes
          ? wakeMinutes - bedMinutes
          : 1440 - bedMinutes + wakeMinutes;
  
      sleepBehavior = {
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60,
      };
    }
    setGoal((prevBehavior) => {
      const updatedBehavior = prevBehavior.map((b) => {
          console.log("Current behavior type:", b.goalType); // Log to verify goalType
          return {
              ...b,
              behaviorValue:
                  b.goalType === "activity"
                      ? activityBehaviorMinutes
                      : b.goalType === "screentime"
                      ? screentimeBehaviorMinutes
                      : b.goalType === "eating"
                      ? eatingBehaviorServings
                      : b.goalType === "sleep"
                      ? `${sleepBehavior.hours} hours ${sleepBehavior.minutes} minutes`
                      : b.goalValue, // Fallback
          };
      });
      console.log("Updated behavior:", updatedBehavior); // Log updated behaviors
      return updatedBehavior;
  });
  
    
  };
  // Handling custom "Other" activities
  const handleCustomActivity = (activityName, section) => {
    return `${activityName}: Expected ${goalInputs?.[section]?.[activityName]?.hours || 0}h ${goalInputs?.[section]?.[activityName]?.minutes || 0}m, 
            Tracked ${behaviorInputs?.[section]?.[activityName]?.hours || 0}h ${behaviorInputs?.[section]?.[activityName]?.minutes || 0}m`;
  };

  calculateQuantities(goalInputs, behaviorInputs);

  // Activity tracking
  if (goalType === "activity") {
    const activities = selectedItems?.activity || [];
    additionalInfo = `Activities: ${activities.map(item =>
      handleCustomActivity(item, 'activity')
    ).join(", ")}`;
    
    recommendedValue = "60 minutes";
    goalValue =`${activityGoalMinutes} minutes`
    actualValue= `${activityBehaviorMinutes} minutes`
    goalMet = activityBehaviorMinutes >= 60; // Recommended goal is 60 minutes
    // personalGoalMet = totalTrackedTime?.activity >= (goalValueInt); 
    selectedItem = selectedItems.activity;
  }

  // Screentime tracking
  else if (goalType === "screentime") {
    const screentimeActivities = selectedItems?.screentime || [];
    additionalInfo = `Screentime Activities: ${screentimeActivities.map(item =>
      handleCustomActivity(item, 'screentime')
    ).join(", ")}`;
  
    recommendedValue = "120 minutes";
    goalValue = `${screentimeGoalMinutes} minutes`
    console.log("actualValue--------",behaviorInputs.screentime);
    actualValue=  `${screentimeBehaviorMinutes} minutes`
    const totalMinutesTracked = totalTrackedTime?.screentime || 0;
  
    const schoolWorkRelated = screentimeActivities.some(item => item.toLowerCase().includes("school") || item.toLowerCase().includes("work"));
  
    goalMet = screentimeBehaviorMinutes <= 120; // Recommended goal is 120 minutes
    // personalGoalMet = totalMinutesTracked <= (goalValueInt); 
    selectedItem = selectedItems.screentime;
  }

  // Eating fruits and vegetables tracking
  else if (goalType === "eating") {
    const eatingItems = selectedItems?.eating || [];
    additionalInfo = `Eating Activities: ${eatingItems.map(item =>
      handleCustomActivity(item, 'eating')
    ).join(", ")}`;
    
    recommendedValue = "5 servings";
    goalValue =`${eatingGoalServings} servings`
    actualValue= `${eatingBehaviorServings} servings`
    goalMet = eatingBehaviorServings >= 5; // Recommended goal is 5 servings
    // personalGoalMet = totalTrackedTime?.eating >= goalValueInt; 
    selectedItem = selectedItems.eating;
  }
      
  // Sleep tracking
  else if (goalType === "sleep") {
    const totalMinutesTracked = totalTrackedTime?.sleep || 0;
    recommendedValue = "8 - 10 hours";

    const bedTime = goalInputs?.sleep?.["Expected Sleep"]?.bedTime || "";
    const wakeUpTime = goalInputs?.sleep?.["Expected Sleep"]?.wakeUpTime || "";
    const trackedBedTime = behaviorInputs?.sleep?.["Actual Sleep"]?.bedTime || "";
    const trackedWakeUpTime = behaviorInputs?.sleep?.["Actual Sleep"]?.wakeUpTime || "";

    additionalInfo = `Expected Sleep: Bed Time - ${bedTime}, Wake Up Time - ${wakeUpTime}, 
      Tracked Sleep: Bed Time - ${trackedBedTime}, Wake Up Time - ${trackedWakeUpTime}`;

    goalMet = "don't evaluate this"
    // personalGoalMet = totalTrackedTime?.sleep >= goalValueInt; 
    selectedItem = selectedItems.sleep;
    goalValue = `${sleepGoal.hours}:${sleepGoal.minutes}`;
    actualValue = `${sleepBehavior.hours}:${sleepBehavior.minutes}`;
  }
  
  
  // Send the request to the chatbot
  try {
    // Send the request to the chatbot
    const chatbotResponse = await axios.post(`${DATABASE_URL}/chatbot/v1`, {
      prompt: [
        {
          role: "system",
          content: `Provide feedback based on the user's actual behavior compared to both their set personal goals and recommended goals.`,
        },
        {
          role: "user",
          content: `Goal Type: ${goalType}, Recommended Value by defualt: ${recommendedValue}, goal that student set: ${goalValue}
                    goal that student acheived: ${actualValue}, reflection: ${reflection}, Personal Goal Met: ${personalGoalMet}
                    recommended goal met: ${goalMet}`,
        },
      ],
    });


    

    console.log("Activity Goal Minutes:", activityGoalMinutes);
    console.log("Screentime Goal Minutes:", screentimeGoalMinutes);
    console.log("Eating Goal Servings:", eatingGoalServings);
    console.log("Sleep Goal Minutes:", sleepGoal );
    console.log("activityBehaviorMinutes", activityBehaviorMinutes)
    console.log("screentimeBehaviorMinutes", screentimeBehaviorMinutes)
    console.log("eatingBehaviorServings", eatingBehaviorServings)
    console.log("sleepBehaviour", sleepBehavior)

    if (goalType == "activity"){
      await updateMinutesInDatabase(
        user,
        goalType,
        activityGoalMinutes,
        screentimeGoalMinutes,
        eatingGoalServings,
        sleepGoal,
        activityBehaviorMinutes,
        screentimeBehaviorMinutes,
        eatingBehaviorServings,
        sleepBehavior
      );
    }
    else if (goalType == "screentime"){
      await updateMinutesInDatabase(
        user,
        "screentime",
        activityGoalMinutes,
        screentimeGoalMinutes,
        eatingGoalServings,
        sleepGoal,
        activityBehaviorMinutes,
        screentimeBehaviorMinutes,
        eatingBehaviorServings,
        sleepBehavior
      );
    }
    else if (goalType == "eating"){
      await updateMinutesInDatabase(
        user,
        "eating",
        activityGoalMinutes,
        screentimeGoalMinutes,
        eatingGoalServings,
        sleepGoal,
        activityBehaviorMinutes,
        screentimeBehaviorMinutes,
        eatingBehaviorServings,
        sleepBehavior
      );
    }
    else if (goalType == "sleep"){
      await updateMinutesInDatabase(
        user,
        "sleep",
        activityGoalMinutes,
        screentimeGoalMinutes,
        eatingGoalServings,
        sleepGoal,
        activityBehaviorMinutes,
        screentimeBehaviorMinutes,
        eatingBehaviorServings,
        sleepBehavior
      );
    }

    // Update the goal with the chatbot response
    setGoal((prevGoal) => {
      const updatedGoal = prevGoal.map((g) => ({
        ...g,
        feedback: chatbotResponse.data.chat_reply,
      }));
      return updatedGoal;
    });
  
    // Save chatbot response to MongoDB
    await axios.post(`${DATABASE_URL}/ChatbotResponse`, {
      userId: user._id,
      goalType,
      feedback: chatbotResponse.data.chat_reply,
      date: date
    });
  
    setGoalResponseLoading(false); // Stop the loading indicator
  } catch (error) {
    console.error(error);
    setGoalResponseLoading(false); // Stop the loading indicator even in case of an error
  }  
};

const updateMinutesInDatabase = async (
  user,
  goalType,
  activityGoalMinutes,
  screentimeGoalMinutes,
  eatingGoalServings,
  sleepGoal,
  activityBehaviorMinutes,
  screentimeBehaviorMinutes,
  eatingBehaviorServings,
  sleepBehavior
) => {
  try {
    // Update goals collection
    await axios.post(`${DATABASE_URL}/goals`, {
      user: user._id,
      name: user.name,
      goalType: goalType,
      goalValue: goalType === "activity" ? activityGoalMinutes :
                goalType === "screentime" ? screentimeGoalMinutes :
                goalType === "eating" ? eatingGoalServings :
                goalType === "sleep" ? `${sleepGoal.hours} hours ${sleepGoal.minutes} minutes` : 0,
      behaviorValue: goalType === "activity" ? activityBehaviorMinutes :
                    goalType === "screentime" ? screentimeBehaviorMinutes :
                    goalType === "eating" ? eatingBehaviorServings :
                    goalType === "sleep" ? `${sleepBehavior.hours} hours ${sleepBehavior.minutes} minutes` : 0,
      dateToday: new Date()
    });

    // Update behaviors collection
    await axios.post(`${DATABASE_URL}/behaviors`, {
      user: user._id,
      name: user.name,
      goalType: goalType,
      date: new Date().toLocaleDateString(),
      dateToday: new Date(),
      goalValue: goalType === "activity" ? activityGoalMinutes :
                goalType === "screentime" ? screentimeGoalMinutes :
                goalType === "eating" ? eatingGoalServings :
                goalType === "sleep" ? `${sleepGoal.hours} hours ${sleepGoal.minutes} minutes` : 0,
      behaviorValue: goalType === "activity" ? activityBehaviorMinutes :
                    goalType === "screentime" ? screentimeBehaviorMinutes :
                    goalType === "eating" ? eatingBehaviorServings :
                    goalType === "sleep" ? `${sleepBehavior.hours} hours ${sleepBehavior.minutes} minutes` : 0
    });

    console.log(`Successfully updated ${goalType} minutes in database`);
  } catch (error) {
    console.error(`Error updating ${goalType} minutes:`, error);
  }
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
      console.log("newGoalValue", newGoalValue)
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