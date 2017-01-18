import React from 'react';
import RefreshButton from './RefreshButton';
import { shallow } from 'enzyme';

it('calls media.fetch on click', () => {
  const refreshButton = shallow(<RefreshButton />);
  const fetchMock = window.fetch = jest.fn(() => new Promise(() => {}));
  refreshButton.simulate('click');
  expect(fetchMock).toHaveBeenCalled()
})
