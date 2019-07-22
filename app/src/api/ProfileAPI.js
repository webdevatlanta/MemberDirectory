//import data from '../data/data.json';
import * as api from './ProfileAPI_private.js';

export default {
  async fetchAll() {
    const data = await api.fetchMemberList();
    const members = data.members
      .map( api.assignGistUrl )
      .map( api.assignAvatarUrl )
      .map( api.assignGithubUrl );

    return Promise.all( members.map( api.assignGistContent ) );
  }
}

