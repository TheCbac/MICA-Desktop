# Overview

  1) Added test suites for: 
    * Quick Access Bar
    * Frecency Algorithm
      in 'test/ThingsThatDoNotExistYet/frecencyBarThings'

  2) Figured out how to disable the development tools building standalone application.
    * In main.development.js when a new BrowserWindow is created, we have to set the
      webPreferences.devTools variable to false.

  3) Added a test for rawData variable from 'test/parseFunction/parseDataPacket.js'.
    * There is no direct way of grabbing private variables from the parseDataPacket function. 
      I am able to get the value of rawData in 'test/parseFunction/parseDataPacketTest.spec.js' by
      using sinon to spy on the twosCompToSigned function, I can use spyCall.args to get the arguments passed
      to the spy.



# Additional Notes

  * To update a snapshot, delete the snapshot file in the test directory. Running 'yarn test -- -u' does not work.

# frecencyBarAlgorithm.js explanation

  Location: test/ThingsThatDontExistYet/frecencyBarThings/frecencyBarAlgorithm.js
  
  Overview: This file contains the algorithm written by Kade that assigns a 'frecency' value to objects.

  ## Breakdown
    
    1) Define variables
      * thingsArray is an array that will contain objects that have 'score', 'lastUpdateTime', and 'name' as their properties.
      * numberOfThingsToBeSorted is the number that determines how many items are in thingsArray.
      * fakeLastUpdateTimesArray is an array of times in milliseconds. 
      * namesArray is an array of names that will be assigned to each item in thingsArray. The names are needed in order to 
        * test whether the function sorts the objects correctly later on.
      * scoreObject is a object template that will be pushed into thingsArray and then configured within the formatArray function.
    
    2) Functions
      * currentScore and updateScore are the functions written by Kade during the meeting that we had on August 8 (last Tuesday).
      * formatArray is a function creates the array of Objects by pushing a scoreObject into thingsArray[i] (within a for loop)
        * and then changes the object's lastUdpateTime and name to the corresponding value from fakeLastUpdateTimesArray[i] and namesArray[i] 
        * respectively. Then, the Object's score is calculated using currentscore(thingsArray[i]). After calling formatArray, the new thingsArray
        * looks like this:
      * 
      *                [ { lastUpdateTime: 1502894556.535,
      *                    score: 8.936455123778273,
      *                    name: 'thing1' },
      *                  { lastUpdateTime: 1502894526.535,
      *                    score: 4.968227561889137,
      *                    name: 'thing2' },
      *                  { lastUpdateTime: 1502894546.535,
      *                    score: 7.299168606192021,
      *                    name: 'thing3' },
      *                  { lastUpdateTime: 1502894541.535,
      *                    score: 6.611921236606339,
      *                    name: 'thing4' },
      *                  { lastUpdateTime: 1502894536.535,
      *                    score: 5.999653435997135,
      *                    name: 'thing5' },
      *                  { lastUpdateTime: 1502894493.535,
      *                    score: 2.8512436165841173,
      *                    name: 'thing6' },
      *                  { lastUpdateTime: 1502894472.535,
      *                    score: 2.1395741181489867,
      *                    name: 'thing7' },
      *                  { lastUpdateTime: 1502894516.535,
      *                    score: 4.149511538361619,
      *                    name: 'thing8' },
      *                  { lastUpdateTime: 1502894535.535,
      *                    score: 5.885348325064533,
      *                    name: 'thing9' },
      *                  { lastUpdateTime: 1502894551.535,
      *                    score: 8.070414345046775,
      *                    name: 'thing10' } ]
      * 
      * sortThings is a function that rearranges the Objects in thingsArray and puts them in ascending order based on score. 

# frecencyBarAlgorithm.spec.js explanation (Test)

  Location: test/ThingsThatDontExistYet/frecencyBarThings/frecencyBarAlgorithm.spec.js

  Overview: Test for frecencyBarAlgorithm.js.

  ## Breakdown  

    1) Import rewired version of frecencyBarAlgorithm.js
      * to use babel-plugin-rewire, do this:  import '__RewireAPI__ from 'file/path/goes/here'

    2) Set up spies using sinon and set variables in frecencyBarAlgorithm.js using babel-plugin-rewire

    3) (Still a work in progress) Simulate clicks on each element in thingsArray
      * I want to test whether calling updateScore will change thingsArray[i].score correctly. However, I there is
        * an issue that still needs to be worked out:
        *
        *     -> Using babel-plugin-rewire to set thingsArray[i].score does not work. It creates a new property (also named score)
        *        instead. To work around this, I am creating a new array called arrayOfNewScores which stores the new score after calling
        *        updateScore a certain amount of times. Although I get values in arrayOfNewScores, I have a feeling that these new scores are not 
        *        accurately simulating a user clicking because I am not simulating time in between each click. For the future I hope to simulate
        *        time and produce a more realistic test.
        *
    
    4) Test for formatArray

    5) Test for sortThings
      * I created an array called correctlySortedNameArray, which has the names from from the Objects in thingsArray in the correct order based on 
         * score. I can then check whether each element in thingsArray[i] has the correct name. 

# quickAccessBar.spec.js (Test)

  * Note: quickAccessBar.spec.js currently fails to run because a QuickAccessBar.js file does not exist yet.

  Location: test/thingsThatDontExist/quickAccessBar.spec.js

  Overview: Test for the QuickAccessBar component

  ## Requriements for QuickAccessBar component

    1) QuickAccessBar needs to render one quickAccessBar.

    2) QuickAccessBar sorts components in order based on score.

    3) Elements in the quickAccessBar have a pin/unpin component called UnpinComponentButton (it does not have to be named that, it was just the 
       first thing that came to mind).

    4) QuickAccessBar has an array of Objects containing React components called componentArray. The Objects in componentArray also have a score property.
  