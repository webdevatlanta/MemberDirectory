import CardAPI from './CardAPI.js'
import config from  '../config.test.json'

afterEach(() => {
  fetch.resetMocks();
});

it('Yields an informative error if the memberlist file contents are not JSON.', () => {
  const response = {
    sha:"abc",
    content: btoa("this-is-invalid-json"),
  }

  fetch.mockResponseOnce(JSON.stringify(response), {status:200})

  const expectedErrorMessage = "Failed to parse the memberlist contents as JSON";

  return CardAPI.buildCards(config.data.memberlist)
    .catch(e => expect(e.message).toEqual("The memberlist file contains invalid JSON.") );
})

it('The randomizer function should shuffle the card order.', () => {
  // See setupTests.js for mocked Math.random()
  const arr = CardAPI.randomizeOrder([3,2,1]);
  expect(arr).toEqual([1,2,3]);
});
