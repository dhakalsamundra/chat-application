import React, { createContext, useReducer, useContext } from 'react'

const MessageStateContext = createContext()
const MessageDispatchContext = createContext()

const messageReducer = (state, action) => {
    let duplicateUsers, userIndex
    const { username, message, messages } = action.payload

  switch (action.type) {
      case 'SET_USERS':
          return {
              ...state,
              users: action.payload
          }
        case 'SET_USER_MESSAGES':
          duplicateUsers = [...state.users]

           userIndex = duplicateUsers.findIndex((u) => u.username === username)
    
          duplicateUsers[userIndex] = { ...duplicateUsers[userIndex], messages }
    
          return {
            ...state,
            users: duplicateUsers,
          }
        
        case 'SET_SELECTED_USER':
            duplicateUsers = state.users.map(user => ({
                ...user,
                selected: user.username === action.payload
            }))
            return {
                ...state,
                users: duplicateUsers
            }
        case 'ADD_MESSAGE':
          duplicateUsers = [...state.users]

      userIndex = duplicateUsers.findIndex((u) => u.username === username)

      let newUser = {
        ...duplicateUsers[userIndex],
        messages: duplicateUsers[userIndex].messages
          ? [message, ...duplicateUsers[userIndex].messages]
          : null,
        latestMessage: message,
      }

      duplicateUsers[userIndex] = newUser

      return {
        ...state,
        users: duplicateUsers,
      }
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, { users: null })

  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  )
}

export const useMessageState = () => useContext(MessageStateContext)
export const useMessageDispatch = () => useContext(MessageDispatchContext)
