import Media from './Media';

// TODO: /api/instagram/media needs to return list of objects
// not list of lists...
const response = `[
    [1, 2, 3, {}],
    [1, 2, 3, {}],
    [1, 2, 3, {}]
]`

const mockResponse = (status, statusText, response) => {
  return new window.Response(response, {
    status: status,
    statusText: statusText,
    headers: {
      'Content-type': 'application/json'
    }
  });
};

it('goes through everything', () => {
  window.fetch = jest.fn(() => {
    return Promise.resolve(mockResponse(200, null, response));
  });

  return Media.fetch().then(() => {
    expect(Media.list).toHaveLength(3)
    expect(Media.loading).toBeFalsy();
  })
});

it('calls error on non 200', () => {
  window.fetch = jest.fn().mockImplementation(() => {
    return Promise.resolve(mockResponse(500));
  });
  console.error = jest.fn();

  return Media.fetch().then(() => {
    // We do not expect to get into then on error
    expect(false).toBeTruthy();
  }).catch(() => {
    expect(Media.loading).toBeFalsy();
    expect(console.error).toHaveBeenCalled();
  })
});
