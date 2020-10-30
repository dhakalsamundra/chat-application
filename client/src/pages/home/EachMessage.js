import React, { useState} from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { OverlayTrigger, Tooltip, Button, Popover } from 'react-bootstrap'

import { useAuthState } from '../../context/auth'

const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎', ' 🤷‍♀️', ' 🤷‍♂️']

export default function EachMessage({ message }) {
  const { user } = useAuthState()
  const sent = message.from === user.username
  const received = !sent
  const [showPopover, setShowPopover] = useState(false)

  const reactToMessage= each=> {
    console.log(`Reacting ${each} to message: ${message.uuid}`)
  }
  const reactionButton = (
    <OverlayTrigger trigger='click' placement='top' show={showPopover}
      onToggle={setShowPopover} transition={false} overlay={
        <Popover className='rounded-pill'>
            <Popover.Content>
              {reactions.map((each) => ( <Button variant="link" className='reactButton' key={each}
              onClick={() => reactToMessage(each)}>
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
          className={classNames('py-2 px-3 rounded-pill', {
            'bg-primary': sent,
            'bg-secondary': received,
          })}
        >
          <p className={classNames({ 'text-white': sent })} key={message.uuid}>
            {message.content}
          </p>
        </div>
    </OverlayTrigger>
    { received && reactionButton}

    </div>
  )
}
