import axios from 'axios';

export const SET_DATA = 'SET_DATA';
export const SET_ERROR = 'SET_ERROR';
export const SET_USER_INFO = 'SET_USER_INFO';

export const setData = (gameId, data) => ({
  type: SET_DATA,
  payload: { gameId, data },
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

// Async Action to fetch data for a specific game
export const fetchDataFromAPI = (gameId) => {
  return (dispatch) => {
    const data = {
      ACTIVE_USERS: 100,
      TOTAL_REWARDS: 5000,
      TOTAL_BETTING: 2000,
      THIS_BOARD_AMOUNT: 1000,
      THIS_BOARD_WINNERS: 10,
      WINNER_FRUITS: ['apple', 'banana'],
    };
    dispatch(setData(gameId, data));
  };
};

export const setUserInfo = (gameId, userInfo) => ({
  type: SET_USER_INFO,
  payload: { gameId, userInfo },
});

export const fetchUserInfo = (gameId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`http://localhost:3000/fetch-data/3`);
      const userInfo = response.data;

      dispatch(setUserInfo(gameId, userInfo));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };
};
