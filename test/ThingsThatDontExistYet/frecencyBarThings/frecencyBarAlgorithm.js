// @flow
/* eslint no-plusplus: 0 */
/* eslint max-len: 0 */
/* **********************************************************
* File: test/ThingsThatDontExistYet/frecencyBarThings/frecencyBarAlgorithm.js
*
* Brief: Function for the frecnecy bar item sorter
*
* Author: George Whitfield
* Date: 2017.08.09
*
**********************************************************/
const date = new Date();

const startFakeSeconds = (date.getTime() / 1000);

// console.log(startFakeSeconds);
// console.log('startFakeSeconds^^^^^^');

const halfLife = 30; // half life is 30 seconds (30000 miliseconds)

let thingsArray = [];
const numberOfThingsToBeSorted = 10; // number of elements to be sorted using frecency functions
/* fakeLastUpdateTimesArray must have length of numberOfThingsToBeSorted */
let fakeLastUpdateTimesArray = [
  // fake time 'x' seconds ago.
  startFakeSeconds - 10,
  startFakeSeconds - 40,
  startFakeSeconds - 20,
  startFakeSeconds - 25,
  startFakeSeconds - 30,
  startFakeSeconds - 73,
  startFakeSeconds - 94,
  startFakeSeconds - 50,
  startFakeSeconds - 31,
  startFakeSeconds - 15];
const namesArray = ['thing1', 'thing2', 'thing3', 'thing4', 'thing5', 'thing6', 'thing7', 'thing8', 'thing9', 'thing10'];
const scoreObject = {
  /* random starting value for score object */
  lastUpdateTime: 1,
  score: 10,
  name: 'name'
};

function currentScore(thing: Object) {
  const date = new Date();
  const getTimes = date.getTime();
  const x = thing.score;
  return (((0.5 ** (((getTimes / 1000) - thing.lastUpdateTime) / halfLife)) * x) + 1);
}

/* Simulate a click from the user */
function updateScore(scoreOb) {
  return Number(currentScore(scoreOb) + 1);
}

let i;
// Create the new array
function formatArray() {
  for (i = 0; i < numberOfThingsToBeSorted; i++) {
    const scoreObjectCopy = Object.assign({}, scoreObject);
    thingsArray.push(scoreObjectCopy);
    thingsArray[i].lastUpdateTime = fakeLastUpdateTimesArray[i];
    thingsArray[i].score = currentScore(thingsArray[i]);
    thingsArray[i].name = namesArray[i];

    // console.log(thingsArray[i].lastUpdateTime);
    // console.log('thingsArray lastUpdateTime');
    // console.log(thingsArray);
  }
}

/* Sort objects based on score in increasing order */
function sortThings() {
  function sortScores(a, b) {
    if (a.score < b.score) {
      return -1;
    } else if (a.score > b.score) {
      return 1;
    } else {
      return 0;
    }
  }
  const sortedArray = thingsArray.sort(sortScores);
  return sortedArray;
}

export default { currentScore, updateScore, formatArray, sortThings, thingsArray };
