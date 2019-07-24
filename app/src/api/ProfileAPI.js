import * as api from './ProfileAPI_private.js';

export default {
  async fetchAll(config) {
    const fetched = await api.fetchMemberList(config.member_masterlist);
    const members = fetched.members
      .map(api.assignGistUrl)
      .map(api.assignGithubUrl);

    return Promise.all(members.map(api.assignProfile));
  },
};
