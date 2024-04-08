import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import '../styles/ReviewCard.css'
import ReplyForm from '../components/ReplyForm'
import axios from 'axios'
import Cookies from 'universal-cookie'

const ReviewCard = ({ review, addReply }) => {
  const [userName, setUserName] = useState('')
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [reviewReplies, setReviewReplies] = useState([])
  const [replyUserNames, setReplyUserNames] = useState({})
  const fetchReplyUserNames = async (uniqueUserIds) => {
    const names = {}
    try {
      const responses = await Promise.all(
        uniqueUserIds.map((userId) => axios.get(`/users/${userId}`))
      )
      responses.forEach((response) => {
        const user = response.data
        console.log('User detail:', user) // This should show the user object including the user_name field
        names[user.user_id] = user.user_name // This should match the field from your user object
      })
    } catch (error) {
      console.error('Error fetching reply user names:', error)
      // If there's an error, we could set a default name or handle it as needed
    }
    setReplyUserNames(names)
  }

  useEffect(() => {
    // Function to fetch the user name from the API
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`/user/${review.user_id}`)
        setUserName(response.data)
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching user name:', error)
        setUserName('Anonymous')
      }
    }
    const fetchReplies = async () => {
      try {
        const response = await axios.get(`/reviews/${review.review_id}/replies`)
        setReviewReplies(response.data)
      } catch (error) {
        console.error('Error fetching replies:', error)
      }
    }

    if (reviewReplies.length > 0) {
      // Get unique user_ids from the replies
      const uniqueUserIds = [
        ...new Set(reviewReplies.map((reply) => reply.user_id))
      ]
      fetchReplyUserNames(uniqueUserIds)
    }

    // Call the function if user_id is available
    if (review.user_id) {
      fetchUserName()
    }
    fetchReplies()
  }, [review.user_id, review.review_id])

  // useEffect for fetching reply user names, triggered when reviewReplies changes
  useEffect(() => {
    if (reviewReplies.length > 0) {
      const uniqueUserIds = [
        ...new Set(reviewReplies.map((reply) => reply.user_id))
      ]
      fetchReplyUserNames(uniqueUserIds)
    }
  }, [reviewReplies])

  const stars = Array.from({ length: review.rating || 0 }, (_, index) => (
    <FontAwesomeIcon
      key={index}
      icon={faStar}
      className='star'
      data-testid='star'
    />
  ))

  const submitReply = async (replyText) => {
    try {
      const cookies = new Cookies()
      const userIdFromCookie = cookies.get('userID') // Read the userID cookie
      const response = await axios.post(
        `/reviews/${review.review_id}/replies`,
        {
          user_id: userIdFromCookie, // This should be the ID of the user making the reply
          reply_text: replyText
        }
      )

      // Update the local component state with the new reply
      setReviewReplies([...reviewReplies, response.data])

      // Update the parent state if necessary
      addReply(review, replyText)
    } catch (error) {
      console.error('Error submitting reply:', error)
    }
    setShowReplyForm(false)
  }

  // Default tags and replies to an empty array if null
  const tags = Array.isArray(review.tags) ? review.tags : []

  return (
    <div className='review-card'>
      <div className='review-header'>
        <div className='Title-card'>{review.review_title}</div>
        <span className='reviewer-name'>{userName || review.reviewer}</span>
        <div className='review-rating'>
          {stars}
          {review.verifiedPurchase && (
            <FontAwesomeIcon
              icon={faCheckCircle}
              className='verified-purchase-icon'
            />
          )}
        </div>
        <span className='review-date'>{review.review_date || review.date}</span>
      </div>
      <div className='review-tags'>
        {tags.map((tag, index) => (
          <span key={index} className='review-tag'>
            {tag}
          </span>
        ))}
      </div>
      <div className='review-content'>{review.comment || review.content}</div>
      <button onClick={() => setShowReplyForm(!showReplyForm)}>Reply</button>
      {showReplyForm && <ReplyForm submitReply={submitReply} />}

      <div className='review-replies'>
        {reviewReplies.map((reply, index) => (
          <div key={index} className='review-reply'>
            <div className='review-reply-header'>
              <span className='reply-user-name'>
                {replyUserNames[reply.user_id] || 'Anonymous'}
              </span>
              <span className='reply-date'>
                {new Date(reply.reply_date).toLocaleDateString()}
              </span>
            </div>
            <div className='reply-text'>{reply.reply_text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewCard
