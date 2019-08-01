import * as ProfileAPI from './ProfileAPI.js';

export default {
  async buildCards(directory_cfg) {
      const directory = await ProfileAPI.fetchDirectory(directory_cfg);
      if (directory.error) {
        return Promise.reject(directory.error);
      }

      const cards = directory.members
        .map(ProfileAPI.assignGistUrl)
        .map(ProfileAPI.assignGithubUrl)
        .map(ProfileAPI.assignProfile)

      return Promise.all(cards)
  },

  randomizeOrder(cards) {
    return cards.sort( () => Math.random() - 0.5 );
  }
};
