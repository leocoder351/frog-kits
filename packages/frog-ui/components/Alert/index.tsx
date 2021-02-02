import React from 'react';
import classNames from 'classnames';

type Props = {
  type?: 'success' | 'info' | 'warning' | 'error';
  message: string;
};

const Alert: React.FC<Props> = ({ type = 'default', message }) => {
  return (
    <div
      className={classNames('j-alert', {
        [`j-alert-${type}`]: true,
      })}
    >
      {message}
    </div>
  );
};

export default Alert;
