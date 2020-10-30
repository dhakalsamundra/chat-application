import React, { Fragment, useState, useEffect } from 'react'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { Col, Form } from 'react-bootstrap'

import { useMessageDispatch, useMessageState } from "../../context/message";
import EachMessage from './EachMessage'


const GET_MESSAGES = gql`
query getMessages($from: String!){
   getMessages(from: $from){
    uuid from to content createdAt
}
}`
const SEND_MESSAGE = gql`
mutation sendMessage($to: String!, $content: String!) {
  sendMessage(to: $to, content: $content) {
    uuid from to content createdAt
  }
}`

export default function Messages() {
  const { users } = useMessageState()
  const dispatch = useMessageDispatch()

  const [content, setContent] = useState('')

  const selectedUser = users?.find((u) => u.selected === true)
  const messages = selectedUser?.messages

  const [
    getMessages,{
     loading: messagesLoading, data: messagesData },] = useLazyQuery(GET_MESSAGES)

     const [sendMessage] = useMutation(SEND_MESSAGE, {
      onError: (err) => console.log(err),
    })

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } })
    }
    // eslint-disable-next-line
  }, [selectedUser])

  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: 'SET_USER_MESSAGES',
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      })
    }
    // eslint-disable-next-line
  }, [messagesData])

  let selectedChatMarkup
  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p>Select a friend</p>
  } else if (messagesLoading) {
    selectedChatMarkup = <p>Loading..</p>
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map((msg, index) => (
      <Fragment key={msg.uuid}>
        <EachMessage message={msg} />
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="m-0" />
          </div>
        )}
      </Fragment>
    ))
  } else if (messages.length === 0) {
    selectedChatMarkup = <p className="info-text">You are now connected! send your first message!</p>
  }

  const submitMessage = (e) => {
    e.preventDefault()

    if (content.trim() === '' || !selectedUser) return

    setContent('')

    // mutation for sending the message
    sendMessage({ variables: { to: selectedUser.username, content } })
  }
  
  return (
    <Col xs={10} md={8}>
      <div className="messages-box d-flex flex-column-reverse">
        {selectedChatMarkup}
      </div>
      <div>
        <Form onSubmit={submitMessage}>
          <Form.Group className="d-flex align-items-center">
            <Form.Control
              type="text"
              className="message-input rounded-pill p-4 bg-secondary border-0"
              placeholder="Send Message.."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <i
              className="far fa-paper-plane fa-2x text-primary ml-2"
              onClick={submitMessage}
              role="button"
            ></i>
          </Form.Group>
        </Form>
      </div>
    </Col>
  )
}