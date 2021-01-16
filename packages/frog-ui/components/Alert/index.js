import React from 'react';
import t from 'prop-types';
import classNames from 'classnames';

const Alert = props => {
  const { type, message } = props;
  return (
    <div 
      className={classNames('j-alert', {
        [`j-alert-${type}`]: true
      })}>
      {message}
    </div>
  )
}

Alert.propTypes = {
  type: t.oneOf(['success', 'info', 'warning', 'error']),
  message: t.string
};

Alert.defaultProps = {
  type: 'success'
};

export default Alert;