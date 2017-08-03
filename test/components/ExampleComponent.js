
import sinon from 'sinon';
import { shallow } from 'enzyme';

const rewire = rewuire('rewire');
const componentName = rewire('../../app/components/componentName');

//Define variables

const var1 = componentName.__get__('var1');

function setup(propsObj) {
  let props;
  if (propsObj === undefined) {
    props = {
      prop1: '',
      prop2: false,
      prop3: false,
      prop4: []
    };
  } else {
    props = { ...propsObj };
  }
  const actions = {
    method1: sinon.spy(),
    method2: sinon.spy()
  };
  const component = shallow(<componentName
    prop1={props.prop1}
    prop2={props.prop2}
    prop3={props.prop3}
    prop4={props.prop4}
    {...actions}
  />);
  return {
    component,
    actions,
    childComponent: component.find('childComponent'),
  };
}
describe('componentName', () => {
  it('Does something', () => {

  });
  it('Does something else', () => {

  });
  it('method1 does not throw an error', () => {
    const { method1 } = setup();
    expect(componentName)
  });
  it('Does something different when props are set differently', () => {
    const { component } = setup();
    expect(someCondition).toBe(result);
    component.setProps({prop: value});
  });
});