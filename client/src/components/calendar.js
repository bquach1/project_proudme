import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = ({ startDate, endDate }) => {
  const [dateRange, setDateRange] = useState([startDate, endDate]);

  function handleDateChange(range) {
    setDateRange(range);
    console.log(dateRange);
***REMOVED***;

  return (
    <Calendar
      selectRange={true}
      value={dateRange}
      onChange={handleDateChange}
      defaultValue={[startDate, endDate]}
    />
  )
}

export default CalendarComponent;