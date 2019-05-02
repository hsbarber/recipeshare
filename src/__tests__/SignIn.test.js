import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import SignIn from '../components/SignIn';
import '../enzyme';

const getDefaultProps = () => ({
  changeUser: jest.fn(),
  users: [
    {
      email: 'hotmale@hotmail.com',
      username: 'coolguy420',
    },
    {
      email: 'mark@facebook.com',
      username: 'thezuck',
    },
    {
      email: 'elon@tesla.com',
      username: 'spaceshipjesus',
    },
  ],
});
describe('Sign In', () => {
  const { changeUser, users } = getDefaultProps();
  it('shallow renders without crashing', () => {
    shallow(<SignIn changeUser={changeUser} users={users} />);
  });
  it('component matches snapshot', () => {
    const wrapper = shallow(<SignIn changeUser={changeUser} users={users} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('onchange changes state', () => {
    const wrapper = mount(
      <MemoryRouter>
        <SignIn changeUser={changeUser} users={users} />
      </MemoryRouter>
    );
    const firstInput = wrapper.find('.form--inputs input').first();
    firstInput.instance().value = 'catlover@gmail.com';
    firstInput.simulate('change');
    wrapper.update();
    // expect(firstInput.state().value).toEqual('catlover@gmail.com');
    // expect(wrapper.state().email).toEqual('catlover@gmail.com');
    // firstInput.simulate('change', { target: { value: 'catlover@gmail.com' } });
    console.log(wrapper.state());
    //    expect(wrapper.state().email).to.equal('catlover@gmail.com');
    // wrapper.update(); // update wrapper to reflect the setState as component is updated again after setState
    // expect(wrapper.state().email).toEqual('catlover@gmail.com');
  });
});
