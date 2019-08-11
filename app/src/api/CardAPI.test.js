import CardAPI from './CardAPI.js'
import config from  '../config.test.json'

it('fetches memberlist and gists when building cards', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify(TEST_MEMBER_MASTERLIST));
  fetch.mockResponseOnce(TEST_MEMBER_1_PROFILE);
  fetch.mockResponseOnce(TEST_MEMBER_2_PROFILE);

  const {member_masterlist} = config
  return CardAPI.buildCards(member_masterlist)
    .then( members => expect(members.length).toEqual(TEST_MEMBER_MASTERLIST.members.length) )
})

it('returns error if the member directory is unparsable', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(`{"badjson","<- due to unexpected comma"}`)

  expect.assertions(1);
  const expectedError = "member directory is invalid json";

  return CardAPI.buildCards(config.member_masterlist)
    .catch(e => expect(e).toEqual(expectedError) );
})

it('randomizes the card order', () => {
  // See setupTests.js for mocked Math.random()
  const arr = CardAPI.randomizeOrder([3,2,1]);
  expect(arr).toEqual([1,2,3]);
});
