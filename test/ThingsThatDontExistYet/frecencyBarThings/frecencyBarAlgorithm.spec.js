// @flow
/* eslint no-plusplus: 0 */
/* eslint max-len: 0 */
/* eslint no-underscore-dangle: 0 */
/* **********************************************************
* File: test/ThingsThatDontExistYet/frecencyBarThings/frecencyBarAlgorithm.spec.js
*
* Brief: Test for the frecency bar funcitons
*
* Author: George Whitfield
* Date: 2017.08.09
*
**********************************************************/
import sinon from 'sinon';
import { __RewireAPI__ as Rewire } from './frecencyBarAlgorithm';
import * as frecencyAlgorithm from './frecencyBarAlgorithm';

// const clock = sinon.useFakeTimers(100000000);
const arrayOfClicks = [10, 14, 22, 55, 3, 6, 30, 10, 10, 12];
// const arrayOfClicks = [0,0,0,0,0,0,0,0,0,0];

const newThingsArray = [];

const thingsArray = Rewire.__get__('thingsArray');

const currentScoreSpy = sinon.spy(frecencyAlgorithm.currentScore);
const updateScoreSpy = sinon.spy(frecencyAlgorithm.updateScore);
const formatArraySpy = sinon.spy(frecencyAlgorithm.formatArray);
const sortThingsSpy = sinon.spy(frecencyAlgorithm.sortThings);
Rewire.__set__('currentScore', currentScoreSpy);
Rewire.__set__('updateScore', updateScoreSpy);
Rewire.__set__('formatArray', formatArraySpy);
Rewire.__set__('sortThings', sortThingsSpy);
describe('Frecency bar algorithm', () => {
  // const thingsArray = Rewire.__get__('thingsArray');
  
  function getNewThingsArray() {
    /* Generate the array of scoreObjects */
    frecencyAlgorithm.formatArray();
    /* Simulate clicks on each object and update scores */
    
    const arrayOfNewScores = [];
    let i;
    let q;
    
    for (i = 0; i < thingsArray.length; i++) { // iterate through every object in thingsArray
      for (q = 0; q < arrayOfClicks[i]; q++) {
        // call the updateScore number of times indicated at arrayOfClicks at i
        arrayOfNewScores[i] = frecencyAlgorithm.updateScore(thingsArray[i]);
      }
      // Push data from old array into the new array
      newThingsArray.push(thingsArray.slice(i));
      // Set score of each item in array to new score with clicks
      frecencyAlgorithm.thingsArray[i].scoreAfterClicks = arrayOfNewScores[i];
    }
   // console.log(newThingsArray);
   // console.log('newThingsArray');
   // console.log(frecencyAlgorithm.thingsArray);
   // console.log('frecencyAlgorithm.thingsArray ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^');

    // Use the newThingsArray in place of the old thingsArray
    Rewire.__set__('thingsArray', newThingsArray);
    console.log(newThingsArray);
    console.log('Test newThingsArray^ ^ ^ ^ ^ ^^ ^ ^ ^ ');
    console.log(frecencyAlgorithm.thingsArray);
    console.log('Test ThingsArray^ ^ ^ ^ ^ ^^ ^ ^ ^ ');
  }
  it('FormatArray calls each function the correct amount of times', () => {
    frecencyAlgorithm.formatArray();
    // Calls currentScore once per item in thingsArray
    expect(currentScoreSpy.callCount).toBe(10);
  });
  it('Calculates frecency correctly', () => {
    expect(frecencyAlgorithm.thingsArray).toBe(0);
  });
  it('sortThings sorts the array correctly based on score', () => {

  });
  it('Adding clicks will change the score correctly', () => {

  });
});
