import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "css/DailyReports.css";

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
      const response = await axios.get("http://localhost:3001/daily-report", {
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
        {reportData ? (
          <div>
            <h2 className="report-title">
              Report for {selectedDate.toDateString()}
            </h2>
            {reportData.goals ? (
              <div className="report-item">
                <h3>Goals</h3>
                <ul>
                  {Object.entries(reportData.goals).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}</strong>: {JSON.stringify(value)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="no-data">No goals data available.</p>
            )}
            {reportData.behaviors ? (
              <div className="report-item">
                <h3>Behaviors</h3>
                <ul>
                  {Object.entries(reportData.behaviors).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}</strong>: {JSON.stringify(value)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="no-data">No behaviors data available.</p>
            )}
            {reportData.reflection?.length ? (
              <div className="report-item">
                <h3>Reflection</h3>
                {reportData.reflection.map((item, index) => (
                  <p key={index}>{item.reflection}</p>
                ))}
              </div>
            ) : (
              <p className="no-data">No reflection data available.</p>
            )}
            {reportData.feedback?.length ? (
              <div className="report-item">
                <h3>Feedback</h3>
                {reportData.feedback.map((item, index) => (
                  <p key={index}>{item.feedback}</p>
                ))}
              </div>
            ) : (
              <p className="no-data">No feedback available.</p>
            )}
          </div>
        ) : (
          !loading && <p className="no-data">No data for the selected day.</p>
        )}
      </div>
    </div>
  );
};

export default DailyReports;
