import CardAPI from './CardAPI.js'
import config from  '../config.test.json'

afterEach(() => {
  fetch.resetMocks();
});

it('returns error if the member directory is unparsable', () => {
  fetch.mockResponseOnce(`{"badjson","<- due to unexpected comma"}`)

  expect.assertions(1);
  const expectedError = "member directory is invalid json";

  return CardAPI.buildCards(config.data.memberlist)
    .catch(e => expect(e).toEqual(expectedError) );
})

it('randomizes the card order', () => {
  // See setupTests.js for mocked Math.random()
  const arr = CardAPI.randomizeOrder([3,2,1]);
  expect(arr).toEqual([1,2,3]);
});
