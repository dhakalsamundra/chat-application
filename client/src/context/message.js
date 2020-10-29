import React, { createContext, useReducer, useContext } from "react";

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();


const messageReducer = (state, action) => {
    let duplicateUsers
  switch (action.type) {
      case 'SET_USERS':
          return {
              ...state,
              users: action.payload
          }
        case 'SET_USER_MESSAGES':
          const { username, messages} = action.payload
          duplicateUsers = [...state.users]

          const userIndex = duplicateUsers.findIndex((u) => u.username === username)
    
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
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, { users: null });
  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  );
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
