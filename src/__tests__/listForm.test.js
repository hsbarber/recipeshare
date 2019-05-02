import * as React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import ListForm from '../components/ListForm';
import '../enzyme';

describe('ListForm', () => {
  const addItemArray = jest.fn();
  const inputName = 'ingredient';
  it('shallow renders without crashing', () => {
    shallow(<ListForm addItemArray={addItemArray} inputName={inputName} />);
  });
  it('component matches snapshot', () => {
    const wrapper = shallow(
      <ListForm addItemArray={addItemArray} inputName={inputName} />
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('addItemArray called on click of add ingredient button', () => {
    const wrapper = mount(
      <ListForm addItemArray={addItemArray} inputName={inputName} />
    );
    wrapper.find('input').instance().value = 'flour';
    wrapper.find('button').simulate('click', {
      preventDefault: () => {},
    });
    expect(addItemArray).toHaveBeenCalled();
  });
});
