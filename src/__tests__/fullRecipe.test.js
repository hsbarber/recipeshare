import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import '../enzyme';
import FullRecipe from '../components/FullRecipe';
import AuthUserContext from '../components/AuthUserContext';

const fakeItem = [
  {
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
    notes: 'easy soup with squash and butter and sage.',
    recipeTime: undefined,
    steps: [
      { content: 'heat up', id: 1535319837491 },
      { content: 'STIR', id: 1535319837492 },
      { content: 'serve', id: 1535319837493 },
    ],
    time: 1535319939642,
    title: 'Roasted Butternut Squash Soup',
    user: 'hagan',
  },
];
const getDefaultProps = () => ({
  match: {
    isExact: true,
    params: {
      title: 'RoastedButternutSquashSoup',
      path: '/:title',
      url: '/RoastedButternutSquashSoup',
    },
  },
  user: 'hagan',
  authUser: { email: 'haganb3@gmail.com' },
});

describe('RecipeItem', () => {
  const { match, user, authUser } = getDefaultProps();
  it('shallow renders without crashing', () => {
    shallow(<FullRecipe recipes={fakeItem} match={match} />);
  });
  it('recipe matches snapshot', () => {
    const wrapper = shallow(
      <FullRecipe recipes={fakeItem} match={match} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('Edit button available when user logged in and user equals recipe user', () => {
    const wrapper = mount(
      <MemoryRouter>
        <AuthUserContext.Provider value={{ authUser }}>
          <FullRecipe recipes={fakeItem} match={match} user={user} />
        </AuthUserContext.Provider>
      </MemoryRouter>
    );

    expect(wrapper.find('.fullRecipe--edit').exists()).toEqual(true);
    wrapper.unmount();
  });
  it('When user is different, edit button not visible', () => {
    const diffUser = 'sam';
    const wrapper = mount(
      <MemoryRouter>
        <AuthUserContext.Provider value={{ authUser }}>
          <FullRecipe recipes={fakeItem} match={match} user={diffUser} />
        </AuthUserContext.Provider>
      </MemoryRouter>
    );

    expect(wrapper.find('.fullRecipe--edit').exists()).toEqual(false);
    wrapper.unmount();
  });
});
