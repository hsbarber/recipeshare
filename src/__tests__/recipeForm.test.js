import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import toJSON from 'enzyme-to-json';
import { shallow, mount } from 'enzyme';
import '../enzyme';
import RecipeForm from '../components/RecipeForm';
import AuthUserContext from '../components/AuthUserContext';

const fakeRecipe = {
  title: 'Menemen',
  category: 'Mediterranean',
  ingredients: [
    {
      content: '3 tablespoons (45ml) extra-virgin olive oil',
      id: 1535319837489,
    },
    { content: '1/2 teaspoon hot paprika', id: 1535319837488 },
    { content: '1/4 teaspoon dried oregano (optional)', id: 1535319837487 },
    {
      content: '1 small onion, finely diced (about 3/4 cup)',
      id: 1535319837486,
    },
    {
      content:
        '3/4 cup finely diced shishito, Padrón, or Chinese green long pepper',
      id: 1535319837485,
    },
    {
      content: 'Kosher salt and freshly ground black pepper',
      id: 1535319837484,
    },
    {
      content:
        '1/2 cup chopped peeled ripe fresh tomatoes or drained canned tomatoes',
      id: 1535319837483,
    },
    { content: '4 eggs, lightly beaten', id: 1535319837482 },
    { content: 'Minced fresh chives, for garnish', id: 1535319837481 },
  ],
  imageURL:
    'https://firebasestorage.googleapis.com/v0/b/recipes-cc787.appspot.com/o/images%2F3a92e118-0760-4bfc-92b6-d1176a1889d4.jpg?alt=media&token=f9e3c5e5-6766-41be-a35e-d026f1075826',
  link:
    'https://www.seriouseats.com/recipes/2014/09/menemen-turkish-style-scrambled-eggs-tomatoes-chilies-recipe.html',
  notes:
    'Menemen is a dish of eggs scrambled just until barely set, mixed with tomatoes, chilies, and tons of olive oil. ',
  recipeTime: 'Short - less than 1 hour',
  steps: [
    {
      content: `In a medium nonstick or cast iron skillet,
       heat olive oil over low heat until barely warm.
       Add paprika, oregano, onion, and peppers.Season with salt and a very
       generous amount of black pepper.Cook, stirring frequently,
       until very soft, about 8 minutes.Add tomatoes and continue to cook,
       stirring frequently, until deepened in color.
       Remove half of mixture and reserve.`,
      id: 1535319837491,
    },
    {
      content: `Return pan to heat and add beaten eggs.
      Season with salt and pepper. Cook, stirring frequently,
      until eggs are just barely set. Immediately remove from
      heat and gently fold in reserved vegetable mixture.
      Sprinkle with chives, if using, and serve immediately.`,
      id: 1535319837492,
    },
  ],
  user: 'hagan',
};
const getDefaultProps = () => ({
  steps: [],
  ingredients: [],
  errors: {
    form:
      'You have errors in your form that need to be fixed before submitting',
    ingredients: '* You must have at least one ingredient entered.',
    steps: '* You must have at least one step entered.',
    title: '* Please enter your title.',
  },
  user: 'hagan',
  authUser: 'email: haganb3@gmail.com',
  errorAnimate: false,
});
describe('RecipeForm', () => {
  const {
    steps,
    ingredients,
    errors,
    user,
    authUser,
    errorAnimate,
  } = getDefaultProps();
  it('shallow renders without crashing', () => {
    shallow(
      <RecipeForm errors={errors} user={user} errorAnimate={errorAnimate} />
    );
  });
  it('matches snapshot', () => {
    const wrapper = mount(
      <AuthUserContext.Provider value={{ authUser }}>
        <RecipeForm
          steps={steps}
          ingredients={ingredients}
          errors={errors}
          user={user}
          errorAnimate={errorAnimate}
        />
      </AuthUserContext.Provider>
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  it('open and close recipe form only if user logged in', () => {
    const {
      steps,
      ingredients,
      errors,
      user,
      authUser,
      errorAnimate,
    } = getDefaultProps();
    const wrapper = mount(
      <AuthUserContext.Provider value={{ authUser }}>
        <RecipeForm
          steps={steps}
          ingredients={ingredients}
          errors={errors}
          user={user}
          errorAnimate={errorAnimate}
        />
      </AuthUserContext.Provider>
    );
    expect(wrapper.find('.collapse').exists()).toEqual(true);

    wrapper.unmount();
  });
  it('HandleChange is called on input change', () => {
    const { steps, ingredients, authUser, errorAnimate } = getDefaultProps();
    const errors = {};
    const handleChangeSpy = jest.fn();
    const wrapper = mount(
      <AuthUserContext.Provider value={{ authUser }}>
        <RecipeForm
          title="Menemen"
          steps={steps}
          errors={errors}
          ingredients={ingredients}
          errorAnimate={errorAnimate}
          handleChange={handleChangeSpy}
        />
      </AuthUserContext.Provider>
    );
    const title = wrapper.find('.title');
    title.simulate('change', { target: { value: 'Kofta' } });
    expect(handleChangeSpy).toHaveBeenCalled();
    expect(wrapper.find('.errorMsg')).toHaveLength(0);
  });
  it('form shows errors when submit button pressed without fields filled out', () => {
    const { steps, ingredients, errors, authUser } = getDefaultProps();
    const submit = jest.fn();
    const errorAnimate = true;
    const wrapper = shallow(
      <RecipeForm
        handleSubmit={submit}
        errors={errors}
        steps={steps}
        errorAnimate={errorAnimate}
        ingredients={ingredients}
        handleChange={() => {}}
      />
    );

    wrapper.find('form').simulate('submit', {
      preventDefault() {
        jest.fn();
      },
    });
    expect(submit).toHaveBeenCalled();
    expect(wrapper.find('.errorMsg')).toHaveLength(4);
  });
  it('form select category value changes when changed', () => {
    const { steps, ingredients, errors, authUser } = getDefaultProps();
    const handleNewSelect = jest.fn();
    const categoryVal = '';
    const wrapper = mount(
      <MemoryRouter>
        <AuthUserContext.Provider value={{ authUser }}>
          <RecipeForm
            fakeRecipe={fakeRecipe}
            errors={errors}
            steps={steps}
            ingredients={ingredients}
            handleNewSelect={handleNewSelect}
            // categoryVal={categoryVal}
          />
        </AuthUserContext.Provider>
      </MemoryRouter>
    );
    const select = wrapper.find('select').first();
    select.simulate('change', { target: { value: 'Chinese' } });
    wrapper.setProps({ categoryVal: 'Chicken' });
    expect(handleNewSelect).toHaveBeenCalled();
    expect(wrapper.props().categoryVal).toEqual('Chicken');
  });
});
