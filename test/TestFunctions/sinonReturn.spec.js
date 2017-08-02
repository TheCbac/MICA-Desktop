import sinon from 'sinon';
import * as actions from './exampleFunction';

const someFunctionSpy = sinon.spy(actions.someFunction);


describe('Test exampleFunction', () => {
  it('Returns the right thing', () => {
    expect(someFunctionSpy.withArgs(10)).not.toBe(null);
    console.log(someFunctionSpy.returnValues);
  });
});
