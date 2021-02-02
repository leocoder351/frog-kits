import React from 'react';
import renderer from 'react-test-renderer';
import Alert from '../index';

describe('Component <Alert /> Test', () => {
  test('should render default', () => {
    const component = renderer.create(<Alert message="default" />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render specific type', () => {
    const types: any[] = ['success', 'info', 'warning', 'error'];
    const component = renderer.create(
      <>
        {types.map((type) => (
          <Alert key={type} type={type} message={type} />
        ))}
      </>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
