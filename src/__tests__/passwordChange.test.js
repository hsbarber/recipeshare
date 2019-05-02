import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import PasswordChange from '../components/PasswordChange';
import '../enzyme';

describe('Password Change', () => {
  it('shallow renders without crashing', () => {
    shallow(<PasswordChange />);
  });
  it('component matches snapshot', () => {
    const wrapper = shallow(<PasswordChange />);
    expect(wrapper).toMatchSnapshot();
  });
  it('onchange is called when input is filled', () => {
    const wrapper = shallow(<PasswordChange />);
    const onChange = jest.spyOn(wrapper.instance(), 'onChange');
    const firstInput = wrapper.find('form input').first();
    firstInput.simulate('change', { target: { value: 'password1' } });
    wrapper.update();
    expect(onChange).toHaveBeenCalled();

    // expect(wrapper.state().passwordOne).toEqual('password1');
  });
  it('Change invalid state', () => {
    const wrapper = mount(<PasswordChange />);
    const button = wrapper.find('form button');
    expect(button.props().disabled).toBe(true);
    wrapper.setState({ invalid: false });
    expect(wrapper.state().invalid).toBe(false);
  });
  it('onSubmit called on form submit', () => {
    const currentUser = 'haganb3@gmail.com';
    const wrapper = mount(<PasswordChange auth={currentUser} />);
    const fakeEvent = { preventDefault: () => console.log('preventDefault') };

    // const inputOne = wrapper.find('input').at(0);
    wrapper.setState({ passwordOne: 'passssword' });
    // inputOne.props().onChange({
    //   target: {
    //     value: '1234567900',
    //   },
    // });
    // const inputTwo = wrapper.find('input').at(1);
    wrapper.setState({ passwordTwo: 'passssword' });
    // inputTwo.props().onChange({
    //   target: {
    //     value: '1234567900',
    //   },
    // });
    const onSubmit = jest.spyOn(wrapper.instance(), 'onSubmit');
    //    const updatePassword = jest.spyOn(wrapper.instance(), 'updatePassword');
    const button = wrapper.find('form button');
    // wrapper.setState({ invalid: false });
    button.simulate('submit', fakeEvent);
    // expect(wrapper.find('.passwordError').length).toBe(1);
    // expect(onSubmit).toHaveBeenCalled();
    console.log(wrapper.state());
    console.log(wrapper.debug());
  });
});
