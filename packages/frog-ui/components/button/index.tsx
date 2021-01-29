import React from 'react';
import classNames from 'classnames';

type Props = {
  type: 'default' | 'primary' | 'danger' | 'warning';
  onClick: () => void;
};

const Button: React.FC<Props> = ({ children, type = 'default', onClick }) => {
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

export default Button;