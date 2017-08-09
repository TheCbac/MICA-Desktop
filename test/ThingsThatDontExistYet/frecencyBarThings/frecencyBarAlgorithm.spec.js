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

import { __RewireAPI__ as Rewire } from './frecencyBarAlgorithm';
import * as frecencyAlgorithm from './frecencyBarAlgorithm';

const arrayOfClicks = [10, 14, 22, 55, 3, 6, 30, 10, 10, 12];

describe('Frecency bar algorithm', () => {
  // const thingsArray = Rewire.__get__('thingsArray');
  beforeAll(() => {
    /* Generate the array of scoreObjects */
    

    /* Simulate clicks on each object and update scores */
    const arrayOfNewScores = [];
    let i;
    let q;
    const newThingsArray = [];
    /* 
    for (i = 0; i < thingsArray.length; i++) { // iterate through every object in thingsArray
      for (q = 0; q < arrayOfClicks[i]; q++) {
        // call the updateScore number of times indicated at arrayOfClicks at i
        arrayOfNewScores[i] = frecencyAlgorithm.updateScore(thingsArray[i]);
      }
      // Push data from old array into the new array
      newThingsArray.push(thingsArray[i]);
      // Set score of each item in array to new score with clicks
      newThingsArray[i].score = arrayOfNewScores[i];
    }
    // Use the newThingsArray in place of the old thingsArray
    Rewire.__set__({
      thingsArray: newThingsArray
    });
    */
  });
  it('Sorts objects based on frecency correctly', () => {
    frecencyAlgorithm.formatArray();
    expect(frecencyAlgorithm.thingsArray).toBe(0);
  });
  it('formatArray calls currentScore 10 times', () => {

  });
});
