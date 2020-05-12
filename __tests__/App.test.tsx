import React from 'react';
import renderer from 'react-test-renderer';

import App from '../App';

describe('<App />', () => {
  it('has 1 child', () => {
    const tree = renderer.create(<App />).toJSON();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(tree!.children).toHaveLength(1);
  });
  it('renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
