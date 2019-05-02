import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import '../enzyme';
import RecipeItem from '../components/RecipeItem';

const fakeItem = {
  category: 'Mediterranean',
  email: 'haganb3@gmail.com',
  id: '-LKsBjUcn-7KrbxFIlJa',
  imageURL:
    'https://firebasestorage.googleapis.com/v0/b/recipes-cc787.appspot.com/o/images%2F3a92e118-0760-4bfc-92b6-d1176a1889d4.jpg?alt=media&token=f9e3c5e5-6766-41be-a35e-d026f1075826',
  ingredients: [
    { content: 'butter', id: 1535319837489 },
    { content: 'bread', id: 1535319837488 },
    { content: 'cheese', id: 1535319837487 },
  ],
  link: undefined,
  notes: undefined,
  recipeTime: undefined,
  steps: [
    { content: 'heat up', id: 1535319837491 },
    { content: 'STIR', id: 1535319837492 },
    { content: 'serve', id: 1535319837493 },
  ],
  time: 1535319939642,
  title: 'Roasted Butternut Squash Soup',
  user: 'hagan',
};
const getDefaultProps = () => ({
  toggleModal: jest.fn(),
  removeID: {},
  removeRecipe: jest.fn(),
  user: 'hagan',
});
describe('RecipeItem', () => {
  const { toggleModal, removeID, removeRecipe, user } = getDefaultProps();
  it('shallow renders without crashing', () => {
    shallow(
      <RecipeItem
        toggleModal={toggleModal}
        removeID={removeID}
        removeRecipe={removeRecipe}
        user={user}
        recipe={fakeItem}
      />
    );
  });
  it('renders differently with requested', () => {
    const wrapper = shallow(
      <RecipeItem
        toggleModal={toggleModal}
        removeID={removeID}
        removeRecipe={removeRecipe}
        user={user}
        recipe={fakeItem}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('When user does not match recipe.user, recipe dropdown not visible', () => {
    const props = {
      toggleModal: jest.fn(),
      removeID: {},
      removeRecipe: jest.fn(),
      user: 'John',
    };
    const RecipeDropDown = shallow(
      <MemoryRouter>
        <RecipeItem {...props} recipe={fakeItem} />
      </MemoryRouter>
    );
    expect(RecipeDropDown.hasClass('remove')).toBeFalsy();
  });
});

describe('RecipeItem Toggle', () => {
  it('expect delete modal to not be visible, when removeID is blank', () => {
    const props = {
      toggleModal: jest.fn(),
      removeID: {},
      removeRecipe: jest.fn(),
      user: 'hagan',
    };
    const RecipeItemComponent = mount(
      <MemoryRouter>
        <RecipeItem {...props} recipe={fakeItem} />
      </MemoryRouter>
    );
    expect(RecipeItemComponent.find('.deleteDrop').exists()).toEqual(false);
    RecipeItemComponent.unmount();
  });
  it('delete modal becomes visible after remove button is clicked on', () => {
    const props = {
      toggleModal: jest.fn(),
      removeID: { '-LKsBjUcn-7KrbxFIlJa': true },
      removeRecipe: jest.fn(),
      user: 'hagan',
    };
    const RecipeItemComponent = mount(
      <MemoryRouter>
        <RecipeItem {...props} recipe={fakeItem} />
      </MemoryRouter>
    );

    const button = RecipeItemComponent.find('.remove');
    button.simulate('click');

    const dropDown = RecipeItemComponent.find('.dropDown');
    expect(props.toggleModal).toHaveBeenCalled();
    expect(dropDown.find('.deleteDrop').exists()).toEqual(true);

    RecipeItemComponent.unmount();
  });
});
