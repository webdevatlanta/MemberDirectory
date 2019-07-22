// See https://github.com/jefflau/jest-fetch-mock#installation-and-setup
// and https://github.com/jefflau/jest-fetch-mock#using-with-create-react-app
global.fetch = require('jest-fetch-mock')

global.TEST_MEMBERLIST = {
  members: [
    {
      name: "foo",
      github_username: "foofoo",
      gist_id: "123",
    },
        {
      name: "bar",
      github_username: "barbar",
      gist_id: "abc",
    },

  ]
};

global.TEST_MEMBER_1 = "Member 1 Profile Contents";
global.TEST_MEMBER_2 = "Member 2 Profile Contents";
