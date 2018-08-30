import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'

class ScrollTop extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0)
        }
    }
    render() {
        const { children } = this.props;

       return (
        <Fragment>
            {children}
        </Fragment>
       );
    }
}

export default withRouter(ScrollTop);