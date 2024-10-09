import { SET_DATA, SET_ERROR, SET_USER_INFO } from './actions.js';

const initialState = {};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        [action.payload.gameId]: {
          ...state[action.payload.gameId],
          ...action.payload.data,
        },
      };
    case SET_USER_INFO:
      return {
        ...state,
        [action.payload.gameId]: {
          ...state[action.payload.gameId],
          USER_INFO: action.payload.userInfo,
        },
      };
    case SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
