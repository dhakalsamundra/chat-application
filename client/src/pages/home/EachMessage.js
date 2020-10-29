import React from 'react'

export default function EachMessage({ message }) {
    return (
        <div className="d-flex my-3">
        <div className="py-2 px-3 rounded-pill bg-primary">
            <p className ="text-white"key={message.uuid}>{message.content}</p>
        </div>
        </div>
    )
}
