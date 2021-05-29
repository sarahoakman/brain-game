import config from './config.json';

const getJSON = (path, options) =>
  fetch(path, options)
    .then(res => res.json())
    .catch(err => console.warn(`API_ERROR: ${err.message}`));

class API {
  constructor () {
    this.url = 'http://localhost:' + config.BACKEND_PORT;
    this.token = null;
    // empty user => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhcnJ5QHVuc3cuZWR1LmF1IiwiaWF0IjoxNjE4Mzg1NTQzfQ.MZOyVMOfGNRQtLdiTScYKURlWKQG9d9rI1xcC3psqL0';
    // has questions => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhheWRlbkB1bnN3LmVkdS5hdSIsImlhdCI6MTYxNzg1NTg3OH0.TBr2jJEfaL6lGD4SSLH7tqqU6BL-M-HLbiqqJBBwAQM';
  }

  setToken (token) {
    this.token = token;
  }

  makeAPIRequest (path, options) {
    return getJSON(`${this.url}/${path}`, options);
  }

  async register (email, name, password) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name
      }),
    }
    return await this.makeAPIRequest('admin/auth/register', options);
  }

  async login (email, password) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    }
    return await this.makeAPIRequest('admin/auth/login', options);
  }

  async logout () {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
    return await this.makeAPIRequest('admin/auth/logout', options);
  }

  async getQuizzes () {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
    return await this.makeAPIRequest('admin/quiz', options);
  }

  async getQuiz (id) {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
    return await this.makeAPIRequest('admin/quiz/' + id, options);
  }

  async newQuiz (title) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        name: title
      }),
    }
    return await this.makeAPIRequest('admin/quiz/new', options);
  }

  async deleteQuiz (id) {
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
    return await this.makeAPIRequest('admin/quiz/' + id, options);
  }

  async updateQuiz (id, data) {
    const options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        questions: data.questions,
        name: data.name,
        thumbnail: data.thumbnail
      }),
    }
    await this.makeAPIRequest('admin/quiz/' + id, options);
    return await this.getQuiz(id);
  }

  async joinQuiz (id, name) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name
      }),
    }
    return await this.makeAPIRequest('play/join/' + id, options);
  }

  async getQuestion (id) {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
    return await this.makeAPIRequest('play/' + id + '/question', options);
  }

  async putAnswer (id, answers) {
    const options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answerIds: answers
      }),
    }
    return await this.makeAPIRequest('play/' + id + '/answer', options);
  }

  async getAnswer (id) {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
    return await this.makeAPIRequest('play/' + id + '/answer', options);
  }

  async getPlayerResults (id) {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
    return await this.makeAPIRequest('play/' + id + '/results', options);
  }

  async getStatus (id) {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
    return await this.makeAPIRequest('play/' + id + '/status', options);
  }

  async getAdminStatus (id) {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }
    return await this.makeAPIRequest('admin/session/' + id + '/status', options);
  }

  async getResults (id) {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }
    return await this.makeAPIRequest('admin/session/' + id + '/results', options);
  }

  async advanceGame (id) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }
    return await this.makeAPIRequest('admin/quiz/' + id + '/advance', options);
  }

  async startQuiz (id) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }
    return await this.makeAPIRequest('admin/quiz/' + id + '/start', options);
  }

  async stopQuiz (id) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }
    return await this.makeAPIRequest('admin/quiz/' + id + '/end', options);
  }
}

export const api = new API()
