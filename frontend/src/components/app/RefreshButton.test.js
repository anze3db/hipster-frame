import React from 'react';
import RefreshButton from './RefreshButton';
import { shallow } from 'enzyme';
import sinon from 'sinon';


it('calls media.fetch on click', () => {
  const refreshButton = shallow(<RefreshButton />);
  const stub = sinon.stub(window, 'fetch');
  stub.returns(new Promise(() => {}));
  refreshButton.simulate('click');
  expect(stub.called).toBeTruthy()
})
