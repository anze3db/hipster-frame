import React from 'react';
import MoreButton from './MoreButton';
import { shallow } from 'enzyme';

it('calls more.fetch on click', () => {
  const moreButton = shallow(<MoreButton />);
  const button = moreButton.find('FlatButton').first()
  const fetchMock = window.fetch = jest.fn(() => new Promise(() => {}));
  button.simulate('click');
  expect(fetchMock).toHaveBeenCalled()
})
