import React, { useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { Col } from 'react-bootstrap'

import { useMessageDispatch, useMessageState } from "../../context/message";
import EachMessage from './EachMessage'


const GET_MESSAGES = gql`
query getMessages($from: String!){
   getMessages(from: $from){
    uuid from to content createdAt
}
}`

export default function Messages() {
  const { users } = useMessageState()
  const dispatch = useMessageDispatch()

  const selectedUser = users?.find((u) => u.selected === true)
  const messages = selectedUser?.messages

  const [
    getMessages,{
     loading: messagesLoading, data: messagesData },] = useLazyQuery(GET_MESSAGES)

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
    selectedChatMarkup = messages.map((msg) => (
      <EachMessage key={msg.uuid} message={msg} />
    ))
  } else if (messages.length === 0) {
    selectedChatMarkup = <p>You are now connected! send your first message!</p>
  }
  return (
    <Col xs={8}>
         {selectedChatMarkup}
        </Col>
  )
}