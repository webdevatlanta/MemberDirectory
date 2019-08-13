// See https://github.com/jefflau/jest-fetch-mock#installation-and-setup
// and https://github.com/jefflau/jest-fetch-mock#using-with-create-react-app
global.fetch = require('jest-fetch-mock');

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.25;
global.Math = mockMath;

global.MOCK_MEMBER_FOO = {
  name: 'foo',
  github_username: 'foofoo',
  gist_id: '123',
}

global.MOCK_MEMBER_BAR = {
  name: 'bar',
  github_username: 'barbar',
  gist_id: 'abc',
}

global.MOCK_MEMBER_BAZ = {
  name: 'baz',
  github_username: 'bazbaz',
  gist_id: 'xyz',
}

global.MOCK_DIRECTORY = {
  members: [
    MOCK_MEMBER_FOO,
    MOCK_MEMBER_BAR
  ],
};

Object.freeze(global.MOCK_DIRECTORY)

global.MOCK_FOO_PROFILE = 'Member 1 Profile Contents';
Object.freeze(global.MOCK_FOO_PROFILE);

global.MOCK_BAR_PROFILE = {
  avatar: 'https://url/to/avatar',
  status: 'Hi, this is a json profile.',
};
Object.freeze(global.MOCK_BAR_PROFILE);

global.MOCK_BAZ_PROFILE = {
  status: 'Hi, this is a json profile without an avatar.',
};
Object.freeze(global.MOCK_BAZ_PROFILE);
