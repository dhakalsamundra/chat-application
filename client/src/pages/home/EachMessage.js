import React, { useState} from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { gql, useMutation } from '@apollo/client'
import { OverlayTrigger, Tooltip, Button, Popover } from 'react-bootstrap'

import { useAuthState } from '../../context/auth'

const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎', ' 🤷‍♀️', ' 🤷‍♂️']

const REACT_TO_MESSAGE = gql`
mutation reactToMessage($uuid: String! $content: String!){
  reactToMessage(uuid: $uuid, content: $content){
    uuid
  }
}`

export default function EachMessage({ message }) {
  const { user } = useAuthState()
  const sent = message.from === user.username
  const received = !sent
  const [showPopover, setShowPopover] = useState(false)

  const reactIcon = [...new Set(message.reactions.map((r)=>r.content))]
  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onError: error=> console.log(error),
    onCompleted:(data)=> setShowPopover(false)
  })

  const reactOnMessage= each=> {
    console.log(`Reacting ${each} to message: ${message.uuid}`)
    reactToMessage({
      variables: { uuid: message.uuid, content: each}
    })
  }
  const reactionButton = (
    <OverlayTrigger trigger='click' placement='top' show={showPopover}
      onToggle={setShowPopover} transition={false} overlay={
        <Popover className='rounded-pill'>
            <Popover.Content className="d-flex align-items-center react-button-popover px-0 py-1">
              {reactions.map((each) => ( <Button variant="link" className='reactButton' key={each}
              onClick={() => reactOnMessage(each)}>
                {each}
              </Button>))}
            </Popover.Content>
        </Popover>
      }>
    <Button variant='link' className='px-2'><i className='far fa-smile'></i></Button></OverlayTrigger>)

  return (
    <div
        className={classNames('d-flex my-3', {
          'ml-auto': sent,
          'mr-auto': received,
        })}
      >
          { sent && reactionButton}

    <OverlayTrigger
      placement={sent ? 'right' : 'left'}
      overlay={
        <Tooltip>
          {moment(message.createdAt).format('MMMM DD, YYYY @ h:mm a')}
        </Tooltip>
      }
      transition={false}
    >
      
        <div
          className={classNames('py-2 px-3 rounded-pill position-relative', {
            'bg-primary': sent,
            'bg-secondary': received,
          })}
        >
          {message.reactions.length > 0 && (
            <div className=" reactions bg-secondary p-1 rounded-pill">
              {reactIcon} {message.reactions.length}
            </div>
          )}
          <p className={classNames({ 'text-white': sent })} key={message.uuid}>
            {message.content}
          </p>
        </div>
    </OverlayTrigger>
    { received && reactionButton}

    </div>
  )
}

