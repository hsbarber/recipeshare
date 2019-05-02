import * as React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import PrintList from '../components/PrintList';
import '../enzyme';

const getDefaultProps = () => ({
  ingredients: [
    {
      content: 'eggs',
      id: 1552514776779,
    },
    {
      content: 'butter',
      id: 1552514776780,
    },
  ],
  dragEnd: jest.fn(),
  remove: jest.fn(),
});

describe('RecipeForm', () => {
  const { ingredients, dragEnd, remove } = getDefaultProps();
  it('shallow renders without crashing', () => {
    shallow(
      <PrintList
        list={ingredients}
        dragEnd={dragEnd}
        remove={remove}
        name="ingredients"
      />
    );
  });
  it('component matches snapshot', () => {
    const wrapper = shallow(
      <PrintList
        list={ingredients}
        dragEnd={dragEnd}
        remove={remove}
        name="ingredients"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('renders a list based on ingredients props', () => {
    const wrapper = shallow(
      <PrintList
        list={ingredients}
        dragEnd={dragEnd}
        remove={remove}
        name="ingredients"
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('renders correct number of ingredients based on ingredients props', () => {
    const wrapper = mount(
      <PrintList
        list={ingredients}
        dragEnd={dragEnd}
        remove={remove}
        name="ingredients"
      />
    );
    expect(wrapper.find('.rForm--list').children()).toHaveLength(2);
  });
  it('remove function called on click of delete button', () => {
    const name = 'ingredients';
    const id = 1552514776779;
    const wrapper = mount(
      <PrintList
        list={ingredients}
        dragEnd={dragEnd}
        remove={remove}
        name="ingredients"
      />
    );
    expect(wrapper.find('.rForm--list').children()).toHaveLength(2);
    const firstLi = wrapper.find('.rForm--list li').first();
    firstLi.find('.remove').simulate('click', { id, name });
    expect(remove).toHaveBeenCalled();
  });
});
