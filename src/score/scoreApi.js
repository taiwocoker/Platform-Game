import 'regenerator-runtime';

const fetch = require('node-fetch');

// const initGame = async () => {
//   const title = JSON.stringify({
//     name: 'Temple-Run',
//   });
//   const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/';
//   const data = {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: title,
//   };

//   const response = await fetch(url, data);
//   const result = await response.json();

//   return result;
// };

const postScore = async (name) => {
  const post = {
    user: name,
    score: localStorage.score,
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

  arr.sort((a, b) => a[1] - b[1]);

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