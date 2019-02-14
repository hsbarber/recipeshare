import React from 'react';
import { Transition } from 'react-spring';
import withCorrectAccount from './withCorrectAccount';
import EditForm from './EditForm';

class Edit extends React.Component {
  render() {
    const form = <EditForm {...this.props} />;

    return (
      <React.Fragment>
        <Transition
          items={form}
          from={{ transform: 'translate3d(0,-60px,0)', opacity: 0 }}
          enter={{ transform: 'translate3d(0,0px,0)', opacity: 1 }}
          leave={{ transform: 'translate3d(0,60px,0)', opacity: 0 }}
        >
          {form => form && (props => <div style={props}>{form}</div>)}
        </Transition>
      </React.Fragment>
    );
  }
}
export default withCorrectAccount(Edit);
