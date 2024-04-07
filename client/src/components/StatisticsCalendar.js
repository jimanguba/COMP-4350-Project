import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import '../styles/StatisticsCalendar.css'

const StatisticsCalendar = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState(null)

  const onChange = (date) => {
    setSelectedDate(date)
  }

  const getBookTitle = () => {
    if (selectedDate) {
      const matchingData = data.find(
        (d) => d.day === selectedDate.toISOString().split('T')[0]
      )
      return matchingData
        ? `You read: ${matchingData.book}`
        : 'No book read on selected date'
    }
    return 'Select a date to view book title'
  }

  const tileClassName = ({ date }) => {
    const matchingData = data.find(
      (d) => d.day === date.toISOString().split('T')[0]
    )
    if (matchingData) {
      return `book-tile book-tile-${matchingData.value}`
    }
    return null
  }

  return (
    <div className="row">
      <div className="calendar-wrapper">
        <h2>Your Reading Calendar</h2>
        <Calendar
          onChange={onChange}
          value={selectedDate}
          tileClassName={tileClassName}
        />
      </div>
      <div className="book-title-wrapper">
        <h3 className="book-title">{getBookTitle()}</h3>
      </div>
    </div>
  )
}

export default StatisticsCalendar
