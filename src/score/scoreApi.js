import 'regenerator-runtime';

const fetch = require('node-fetch');

const postScore = async (name, score) => {
  const post = {
    user: name, score,
  };
  const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/Zl4d7IVkemOTTVg2fUdz/scores/';
  const data = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  };

  const response = await fetch(url, data);
  const result = await response.json();
  return result.result;
};

const sortPlayers = (input) => {
  const arr = [];

  for (let i = 0; i < input.length; i += 1) {
    arr.push([input[i].user, input[i].score]);
  }

  arr.sort((a, b) => b[1] - a[1]);

  return arr;
};

const getScores = async () => {
  const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/Zl4d7IVkemOTTVg2fUdz/scores/';
  const data = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, data);
  const result = await response.json();

  return sortPlayers(result.result);
};

export { postScore, getScores };