import request from 'superagent'
import * as log from '../Logger'
import _ from 'lodash'

const THIRTY_SECONDS = 1000 * 30
const THREE_MINUTES = 1000 * 60 * 60 * 3
const TIMEOUT = {
  response: THIRTY_SECONDS,
  deadline: THREE_MINUTES
}
const ACCEPT_HEADER = 'application/json; charset=utf-8'
const CONTENT_TYPE = 'application/json; charset=utf-8'

export const UNKNOWN_ERROR = 'unknown error'
export const TIMEOUT_ERROR = 'timeout'

export function post(url, data, headers = {}) {
  return request
    .post(url)
    .send(data)
    .accept(ACCEPT_HEADER)
    .type(CONTENT_TYPE)
    .set(headers)
    .timeout(TIMEOUT)
}

export function patch(url, data, headers = {}) {
  return request
    .patch(url)
    .send(data)
    .accept(ACCEPT_HEADER)
    .type(CONTENT_TYPE)
    .set(headers)
    .timeout(TIMEOUT)
}

export function get(url, headers = {}) {
  return request
    .get(url)
    .accept(ACCEPT_HEADER)
    .set(headers)
    .timeout(TIMEOUT)
}

export function send(request) {
  return request.then((res) => {
    return res.body || res.text
  }).catch((err) => {
    const url = _.get(err, 'url', 'unknown')

    log.error(`An exception was thrown when calling URL '${url}'`, err)

    const status = _.get(err, 'status') || 0
    const body = _.get(err, 'timeout')
      ? TIMEOUT_ERROR
      : _.get(err, 'response.body') || _.get(err, 'message') || UNKNOWN_ERROR

    throw {status, body}
  })
}

export function fakeResponse(body) {
  return Promise.resolve({body})
}

export function abortPendingRequest(req) {
  if (req && _.isFunction(req.abort)) {
    req.abort()
  }
}
