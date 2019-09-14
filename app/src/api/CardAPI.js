import * as ProfileAPI from './ProfileAPI.js';
import * as AdminAPI from './AdminAPI.js';

export default {
  async buildCards(memberlist) {
      const response = await AdminAPI.get(memberlist);
      if (response.error) {
        return Promise.reject(response.error);
      }

      const cards = JSON.parse(response.content).members
        .map(ProfileAPI.assignGistUrl)
        .map(ProfileAPI.assignGithubUrl)
        .map(ProfileAPI.assignProfile)

      return Promise.all(cards)
  },

  randomizeOrder(cards) {
    return cards.sort( () => Math.random() - 0.5 );
  }
};
