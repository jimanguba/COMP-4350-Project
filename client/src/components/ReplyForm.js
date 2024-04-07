import React, { useState } from 'react'

const ReplyForm = ({ submitReply }) => {
  const [replyText, setReplyText] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    submitReply(replyText)
    setReplyText('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Write a reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        required
      />
      <button type="submit">Submit Reply</button>
    </form>
  )
}

export default ReplyForm
