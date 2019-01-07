import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ type = 'checkbox', id, value, checked, onChange }) => (
  <input
    key={id}
    type={type}
    value={value}
    checked={checked}
    onChange={onChange}
  />
);

Checkbox.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default Checkbox;
