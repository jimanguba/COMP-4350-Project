import axios from 'axios'
import React, { useState, useEffect } from 'react'
import ProgressBar from '../components/ProgressBar'

function StatisticsGoal ({ userID }) {
  const [progress, setProgress] = useState(0)
  const [count, setBooksCompleted] = useState(0)
  const [readingGoal, setReadingGoal] = useState(0)
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data including reading goal
        const userDataResponse = await axios.get(`/users/${userID}`)
        const { bookGoal, userName } = userDataResponse.data
        setReadingGoal(bookGoal)
        setUsername(userName)

        // Fetch reading progress after updating the reading goal
        const readingProgressResponse = await axios.get(
          `/users/${userID}/books/num_completed`
        )
        const countData = readingProgressResponse.data[0]
        if (
          countData &&
          countData.count !== undefined &&
          !isNaN(countData.count)
        ) {
          const completedBooksCount = parseInt(countData.count)
          setBooksCompleted(completedBooksCount)
          setProgress((completedBooksCount / bookGoal) * 100)
        } else {
          console.log('Invalid completedBooks value:', countData.count)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to fetch data')
      }
    }

    fetchData()
  }, [userID])

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <h2>{username}'s Reading Statistics</h2>
      <div>
        <h3>
          Your Yearly Reading Goal:{' '}
          {progress >= 100
            ? "Congratulations! You've reached your yearly reading goal!"
            : `Keep going! You're ${progress}% there!`}
        </h3>
        <ProgressBar progress={progress} />
        <p>
          {count} out of {readingGoal} books completed
        </p>
      </div>
    </div>
  )
}

export default StatisticsGoal
