import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons'
import { faStar as faStarFilled } from '@fortawesome/free-solid-svg-icons'
import { faStarHalfAlt as faStarHalf } from '@fortawesome/free-solid-svg-icons'
import BookImg from '../images/book.png'

function StatisticsYear({ userID }) {
  const [averageReadingTime, setAverageReadingTime] = useState(null)
  const [averageRating, setAverageRating] = useState(null)

  const averageStars = (rating) => {
    const roundedRating = Math.round(rating * 2) / 2 // Round to nearest half-star
    const fullStars = Math.floor(roundedRating)
    const hasHalfStar = roundedRating % 1 !== 0

    const stars = []
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <FontAwesomeIcon key={i} icon={faStarFilled} className='star' />
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FontAwesomeIcon key={i} icon={faStarHalf} className='star' />
        )
      } else {
        stars.push(
          <FontAwesomeIcon key={i} icon={faStarEmpty} className='star' />
        )
      }
    }
    return stars
  }

  useEffect(() => {
    // Fetch average reading time
    axios
      .get(`/books/${userID}/average_time`)
      .then((response) => {
        setAverageReadingTime(response.data.average_time)
      })
      .catch((error) => {
        console.error('Error fetching average reading time:', error)
      })

    axios
      .get(`/users/${userID}/average_rating`)
      .then((response) => {
        setAverageRating(response.data.average_rating)
      })
      .catch((error) => {
        console.error('Error fetching average rating:', error)
      })
  }, [userID])

  return (
    <div>
      <h3>So far this year....</h3>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={BookImg}
          alt='Book'
          style={{ marginRight: '10px', width: '100px', height: 'auto' }}
        />
        <div>
          <p>Your average reading time is {averageReadingTime} minutes</p>
          <p>
            Your average book rating is{' '}
            {averageRating && Number(averageRating).toFixed(2)}
            {averageRating && averageStars(averageRating)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatisticsYear
