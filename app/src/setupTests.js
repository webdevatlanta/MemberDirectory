// See https://github.com/jefflau/jest-fetch-mock#installation-and-setup
// and https://github.com/jefflau/jest-fetch-mock#using-with-create-react-app
global.fetch = require('jest-fetch-mock');

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.25;
global.Math = mockMath;

global.TEST_MEMBER_FOO = {
  name: 'foo',
  github_username: 'foofoo',
  gist_id: '123',
}

global.TEST_MEMBER_BAR = {
  name: 'bar',
  github_username: 'barbar',
  gist_id: 'abc',
}

global.TEST_MEMBER_BAZ = {
  name: 'baz',
  github_username: 'bazbaz',
  gist_id: 'xyz',
}

global.TEST_MEMBER_MASTERLIST = {
  members: [
    TEST_MEMBER_FOO,
    TEST_MEMBER_BAR
  ],
};

Object.freeze(global.TEST_MEMBER_MASTERLIST)

global.TEST_FOO_PROFILE = 'Member 1 Profile Contents';
Object.freeze(global.TEST_FOO_PROFILE);

global.TEST_BAR_PROFILE = {
  avatar: 'https://url/to/avatar',
  status: 'Hi, this is a json profile.',
};
Object.freeze(global.TEST_BAR_PROFILE);

global.TEST_BAZ_PROFILE = {
  status: 'Hi, this is a json profile without an avatar.',
};
Object.freeze(global.TEST_BAZ_PROFILE);
