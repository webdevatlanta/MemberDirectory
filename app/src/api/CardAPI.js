import * as ProfileAPI from './ProfileAPI.js';
import * as AdminAPI from './AdminAPI.js';

export default {
  async buildCards(memberlist) {
    return AdminAPI.get(memberlist)
      .then( file => parseContent(file.content) )
      .then( ({members}) => members )
      .then( (members) => members.map(ProfileAPI.assignGistUrl) )
      .then( (members) => members.map(ProfileAPI.assignGithubUrl) )
      .then( (members) => members.map(ProfileAPI.assignProfile) )
      .then( (members) => Promise.all(members) )
  },

  randomizeOrder(cards) {
    return cards.sort( () => Math.random() - 0.5 );
  }
};

function parseContent(content) {
  try {
    return JSON.parse(content);
  } catch(error) {
    throw new Error("The memberlist file contains invalid JSON.")
  }
}
