// See https://github.com/jefflau/jest-fetch-mock#installation-and-setup
// and https://github.com/jefflau/jest-fetch-mock#using-with-create-react-app
global.fetch = require('jest-fetch-mock');

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.25;
global.Math = mockMath;

global.TEST_MEMBER_MASTERLIST = {
  members: [
    {
      name: 'foo',
      github_username: 'foofoo',
      gist_id: '123',
    },
    {
      name: 'bar',
      github_username: 'barbar',
      gist_id: 'abc',
    },
  ],
};

global.TEST_MEMBER_1_PROFILE = 'Member 1 Profile Contents';
global.TEST_MEMBER_2_PROFILE = 'Member 2 Profile Contents';
