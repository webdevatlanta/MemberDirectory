import CardAPI from './CardAPI.js'
import config from  '../config.test.json'

it('fetches memberlist and gists when building cards', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify(TEST_DIRECTORY));
  fetch.mockResponseOnce(TEST_MEMBER_1);
  fetch.mockResponseOnce(TEST_MEMBER_2);

  return CardAPI.buildCards(config.member_masterlist)
    .then( members => expect(members.length).toEqual(TEST_DIRECTORY.members.length) )
})

it('returns error if the member directory is unparsable', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(`{"badjson","<- due to unexpected comma"}`)

  expect.assertions(1);
  const expectedError = "member directory is invalid json";

  return CardAPI.buildCards(config.member_masterlist)
    .catch(e => expect(e).toEqual(expectedError) );
})
