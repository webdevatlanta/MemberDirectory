import CardAPI from './CardAPI.js'
import config from  '../config.test.json'

afterEach(() => {
  fetch.resetMocks();
});

it('fetches memberlist and gists when building cards', () => {
  fetch.mockResponseOnce(JSON.stringify(MOCK_DIRECTORY));
  fetch.mockResponseOnce(MOCK_FOO_PROFILE);
  fetch.mockResponseOnce(MOCK_BAR_PROFILE);

  const {member_masterlist} = config
  return CardAPI.buildCards(member_masterlist)
    .then( members => expect(members.length).toEqual(MOCK_DIRECTORY.members.length) )
})

it('returns error if the member directory is unparsable', () => {
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
