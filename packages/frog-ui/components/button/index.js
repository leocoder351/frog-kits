import React from 'react';
import t from 'prop-types';
import classNames from 'classnames';

const Button = (props) => {
  const { children, type, onClick } = props;

  const handleClick = () => {
    onClick && onClick();
  };

  return (
    <button
      className={classNames('j-btn', {
        [`j-btn-${type}`]: true,
      })}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  type: t.oneOf(['default', 'primary', 'danger', 'warning']),
  onClick: t.func,
};

Button.defaultProps = {
  type: 'default',
};

export default Button;
