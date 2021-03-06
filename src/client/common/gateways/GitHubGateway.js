import {get, patch, post, send as gatewaySend} from './Gateway'
import _ from 'lodash'

const GIST_URL = 'https://api.github.com/gists'
const MIME_TYPE = 'application/vnd.github.v3+json'

export function createGist(description, configuration, oauthToken) {
  const data = {
    description,
    public: false,
    files: {
      'configuration.json': {
        content: configuration
      }
    }
  }

  return post(GIST_URL, data, {Authorization: `token ${oauthToken}`, Accept: MIME_TYPE})
}

export function updateGist(gistId, description, configuration, oauthToken) {
  const data = {
    description,
    files: {
      'configuration.json': {
        content: configuration
      }
    }
  }

  return patch(`${GIST_URL}/${gistId}`, data, {Authorization: `token ${oauthToken}`, Accept: MIME_TYPE})
}

export function getGist(gistId) {
  return get(`${GIST_URL}/${gistId}`, {Accept: MIME_TYPE})
}

export function getTruncatedFile(url) {
  return get(url, {Accept: 'text/plain; charset=utf-8'})
}

export function send(request) {
  return gatewaySend(request).catch((err) => {
    // GitHub errors look like this {"message": "", "documentation_url": ""}
    const status = err.status
    const serverMessage = _.get(err, 'body.message', err.body)
    const message = `${status} - ${serverMessage}`

    throw {status, message}
  })
}
