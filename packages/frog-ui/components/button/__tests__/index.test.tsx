import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import Button from '../index';

describe('Component <Button /> Test', () => {
  let testButtonClicked = false;
  const onClick = () => {
    testButtonClicked = true;
  };

  test('should render default', () => {
    // snapshot test
    const component = renderer.create(<Button onClick={onClick}>default</Button>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // dom test
    render(<Button onClick={onClick}>default</Button>);
    const btn = screen.getByText('default');
    fireEvent.click(btn);
    expect(testButtonClicked).toEqual(true);
  });

  test('should render specific type', () => {
    const types: any[] = ['default', 'primary', 'danger', 'warning'];
    const component = renderer.create(
      <>
        {types.map((type) => (
          <Button key={type} type={type} onClick={onClick}>
            {type}
          </Button>
        ))}
      </>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
