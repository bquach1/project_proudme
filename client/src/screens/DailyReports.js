import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "css/DailyReports.css";
import { DATABASE_URL } from "constants";

const DailyReports = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  const formatDate = (date) => {
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const fetchReport = async (date) => {
    const formattedDate = formatDate(date); 
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("User not logged in.");
      return;
    }

    const decodedToken = decodeToken(token);
    if (!decodedToken || !decodedToken.userId) {
      setError("Invalid or missing userId.");
      return;
    }

    const userId = decodedToken.userId;

    setLoading(true);
    setError("");
    setReportData(null);

    try {
      const response = await axios.get(`${DATABASE_URL}/daily-report`, {
        params: { userId, date: formattedDate },
      });
      console.log("API Response:", response.data); // Debugging log
      setReportData(response.data);
    } catch (err) {
      console.error("Error fetching daily report:", err.response || err.message);
      setError("Failed to fetch daily report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const parseTime = (timeStr) => {
    let [hours, minutes] = timeStr.split(":").map(Number);
    let isPM = /pm$/i.test(timeStr);

    if (isPM && hours < 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }

    return { hours, minutes: minutes || 0 };
  };

  const calculateTotals = (data, type) => {
    let totals = 0;

    if (data && data[type]) {
      for (const key in data[type]) {
        const entry = data[type][key];

        if (type === "activity" || type === "screentime") {
          totals += entry.hours || 0;
          totals += entry.minutes ? entry.minutes / 60 : 0;
        } else if (type === "eating") {
          totals += entry.servings || 0;
        } else if (type === "sleep") {
          const bedtimeParts = parseTime(entry.bedtime);
          const wakeUpTimeParts = parseTime(entry.wakeUpTime);

          const bedtime = new Date(1970, 0, 1, bedtimeParts.hours, bedtimeParts.minutes).getTime();
          let wakeUpTime = new Date(1970, 0, 1, wakeUpTimeParts.hours, wakeUpTimeParts.minutes).getTime();

          if (wakeUpTime < bedtime) {
            wakeUpTime += 24 * 60 * 60 * 1000;
          }

          totals += (wakeUpTime - bedtime) / (1000 * 60 * 60);
        }
      }
    }
    return { totals };
  };

  const renderComponent = (type, title) => {

    const totalGoals = reportData?.goals ? calculateTotals(reportData.goals, type) : { totals : 0 }
    const totalBehaviors = reportData?.behaviors ? calculateTotals(reportData.behaviors, type) : { totals : 0 }
    const reflection = reportData?.reflection?.find((item) => item.goalType === type);
    const feedback = reportData?.feedback?.find((item) => item.goalType === type);

    return (
      <div className="report-card">
        <h3>{title}</h3>
        {reportData ? (
          <ul>
            <li><strong>Planned :</strong> {totalGoals?.totals} {type == 'eating' ? 'servings': 'hrs'} </li>
            <li><strong>Achieved:</strong> {totalBehaviors?.totals} {type == 'eating' ? 'servings': 'hrs'}</li>
            <li><strong>Reflection:</strong> {reflection?.reflection || "No reflection available."}</li>
            <li><strong>AI Feedback:</strong> {feedback?.feedback || "No feedback available."}</li>
          </ul>
        ) : (
          <p className="no-data">No data available for {title}.</p>
        )}
      </div>
    );
  };

  return (
    <div className="daily-reports-container">
      <h1 className="page-title">Daily Reports</h1>
      <p className="instructions">
        Select a date from the calendar to view your AI-generated responses,
        goals, behaviors, and feedback for that day. The calendar is limited to
        the last 30 days.
      </p>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        maxDate={new Date()}
        minDate={new Date(new Date().setDate(new Date().getDate() - 30))} // Limit to last 30 days
        className="calendar"
      />
      <div className="report-section">
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}
        {reportData ? (<div className="grid-container">
            {renderComponent("activity", "Physical Activity")}
            {renderComponent("screentime", "Screen Time")}
            {renderComponent("sleep", "Sleep")}
            {renderComponent("eating", "Fruits and Vegetables")}
          </div>
        ) : (
          !loading && <p className="no-data">No data for the selected day.</p>
        )}
      </div>
    </div>
  );
};

export default DailyReports;
