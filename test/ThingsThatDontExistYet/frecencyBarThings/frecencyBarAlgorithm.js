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
const now = date.getTime();

const halfLife = 30000; // half life is 30 seconds (30000 miliseconds)

let thingsArray = [];
const numberOfThingsToBeSorted = 10; // number of elements to be sorted using frecency functions
/* fakeLastUpdateTimesArray must have length of numberOfThingsToBeSorted */
let fakeLastUpdateTimesArray = [100000, 4000000, 2000000, 50000, 30000000, 700000, 70000000, 50000000, 3000000000, 10000];
let namesArray = ['thing1', 'thing2', 'thing3', 'thing4', 'thing5', 'thing6', 'thing7', 'thing8', 'thing9', 'thing10'];
let scoreObject = {
  /* random starting value for score object */
  lastUpdateTime: 1,
  score: 1,
  name: 'name'
};

function currentScore(thing) {
  return (0.5 ** (halfLife * (now - thing.previousUpdateTime))) * thing.score;
}

/* Simulate a click from the user */
function updateScore(scoreOb) {
  console.log(scoreOb.score);
  console.log('ScoreOb.score^^^^^^^^^^^^^^^^^^^^^^');
  return Number(currentScore(scoreOb.score) + 1);
}

let i;
function formatArray() {
  let newArray =[]
  for (i = 0; i < numberOfThingsToBeSorted; i++) {
    thingsArray.push(scoreObject);
    thingsArray[i].lastUpdateTime = fakeLastUpdateTimesArray[i];
    thingsArray[i].score = currentScore(thingsArray[i]);
    thingsArray[i].name = namesArray[i];
    console.log(i);
    console.log('i^^^^^^^^^^^^^^^^^^^');
    // console.log(thingsArray[i].lastUpdateTime);
    // console.log('thingsArray lastUpdateTime');
    console.log(thingsArray);
    newArray = thingsArray;
  }
}

/* Sort objects based on score */
function sortThings() {
  function sortScores(a, b) {
    return a[1] - b[1];
  }
  const sortedArray = thingsArray.sort(sortScores);
  return sortedArray;
}

export default { currentScore, updateScore, formatArray, sortThings, thingsArray };
