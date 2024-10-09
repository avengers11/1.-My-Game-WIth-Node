import express from 'express';
import store from './redux/store.js';
import { fetchDataFromAPI, fetchUserInfo } from './redux/actions.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Log state changes on subscribe
store.subscribe(() => {
  console.log('Updated state:', store.getState());
});

// Endpoint to fetch data
app.get('/fetch-data/:gameId', (req, res) => {
  const { gameId } = req.params;
  store.dispatch(fetchDataFromAPI(gameId));
  res.send({ message: 'Data fetched successfully!', data: store.getState()[gameId] });
});

app.get('/fetch-user-info/:gameId', async (req, res) => {
  const { gameId } = req.params;
  await store.dispatch(fetchUserInfo(gameId));
  res.send({ message: 'User info fetched successfully!', data: store.getState()[gameId].USER_INFO });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
