import React, { useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { Col } from 'react-bootstrap'


const GET_MESSAGES = gql`
query getMessages($from: String!){
   getMessages(from: $from){
    uuid from to content createdAt
}
}`

export default function Messages({ selectedUser }) {

  const [
    getMessages,{
     loading, data: messagesData },] = useLazyQuery(GET_MESSAGES)

  useEffect(() => {
    if (selectedUser) {
      getMessages({ variables: { from: selectedUser } })
    }
    // eslint-disable-next-line
  }, [selectedUser])

  return (
    <Col xs={8}>
          {messagesData && messagesData.getMessages.length > 0 ? (
            messagesData.getMessages.map((msg) => (
            <p key={msg.uuid}>{msg.content}</p>
            ))
          ) : (
            <p>Messages</p>
          )}
        </Col>
  )
}