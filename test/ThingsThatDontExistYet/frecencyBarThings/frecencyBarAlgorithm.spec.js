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

const arrayOfClicks = [10, 14, 22, 55, 3, 6, 30, 10, 10, 12];
// const arrayOfClicks = [0,0,0,0,0,0,0,0,0,0];

const newThingsArray = [];

const thingsArray = Rewire.__get__('thingsArray');
const namesArray = Rewire.__get__('namesArray');

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
    // Use the newThingsArray in place of the old thingsArray.
    Rewire.__set__('thingsArray', newThingsArray); // For some reason, it's not setting thingsArray correctly.
  }
  it('FormatArray', () => {
    frecencyAlgorithm.formatArray();
    // Calls currentScore once per item in thingsArray
    expect(currentScoreSpy.callCount).toBe(10);
    let i;
    for (i = 0; i < namesArray.length; i++) {
      expect(frecencyAlgorithm.thingsArray[i].name).toBe('thing' + (i + 1));
      expect(frecencyAlgorithm.thingsArray[i].name).toEqual(namesArray[i]);
    }
  });
  it('sortThings sorts the array correctly based on score', () => {
    const correctlySortedNameArray = ['thing7', 'thing6', 'thing8', 'thing2', 'thing9', 'thing5', 'thing4', 'thing3', 'thing10', 'thing1'];
    let i;
    for (i = 0; i < frecencyAlgorithm.thingsArray.length; i++) {
      expect(frecencyAlgorithm.sortThings()[i].name).toEqual(correctlySortedNameArray[i]);
      
    }
  });
  it('Adding clicks will change the score correctly', () => {

  });
});

