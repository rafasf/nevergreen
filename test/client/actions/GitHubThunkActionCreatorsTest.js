import {testThunk, withMockedImports} from '../TestUtils'
import {describe, it} from 'mocha'
import {expect} from 'chai'
import {containsMessage, containsOnlyMessage, mocks} from '../Mocking'

describe('GitHubThunkActionCreators', function () {

  const send = mocks.stub()
  const importError = mocks.spy()
  const importing = mocks.spy()
  const getGist = mocks.stub()
  const getTruncatedFile = mocks.stub()
  const importData = mocks.spy()
  const createGist = mocks.stub()
  const updateGist = mocks.stub()
  const gitHubSetGistId = mocks.spy()
  const gitHubSetDescription = mocks.spy()
  const exporting = mocks.spy()
  const exportSuccess = mocks.spy()
  const exportError = mocks.spy()

  const {restoreFromGitHub, uploadToGitHub} = withMockedImports('client/actions/GitHubThunkActionCreators', {
    '../common/gateways/GitHubGateway': {send, getGist, getTruncatedFile, updateGist, createGist},
    './ImportActionCreators': {importError, importing},
    './ImportThunkActionCreators': {importData},
    './ExportActionCreators': {exporting, exportSuccess, exportError},
    './GitHubActionCreators': {gitHubSetGistId, gitHubSetDescription}
  })

  describe('restoreFromGitHub', function () {

    const validResponse = {
      files: {
        'configuration.json': {
          content: 'some-content',
          truncated: false,
          size: 12,
          raw_url: 'some-url'
        }
      },
      description: 'some-description'
    }

    it('should dispatch importing', function () {
      send.resolves(validResponse)
      return testThunk(restoreFromGitHub('irrelevant')).then(() => {
        expect(importing).to.have.been.called()
      })
    })

    it('should dispatch import error if gist ID is null', function () {
      return testThunk(restoreFromGitHub(null)).then(() => {
        expect(importError).to.have.been.calledWithMatch(containsOnlyMessage('You must provide a gist ID to import from GitHub'))
      })
    })

    it('should dispatch import error if gist ID is blank', function () {
      return testThunk(restoreFromGitHub(' ')).then(() => {
        expect(importError).to.have.been.calledWithMatch(containsOnlyMessage('You must provide a gist ID to import from GitHub'))
      })
    })

    it('should dispatch import error if the gist can not be fetched', function () {
      send.rejects({message: '{"message": "some-error"}'})
      return testThunk(restoreFromGitHub('some-id')).then(() => {
        expect(importError).to.have.been.calledWithMatch(containsMessage('some-error'))
      })
    })

    it('should dispatch import error if the gist does not contain a configuration.json file', function () {
      send.resolves({files: {}})
      return testThunk(restoreFromGitHub('some-id')).then(() => {
        expect(importError).to.have.been.calledWithMatch(containsMessage('gist does not contain the required configuration.json file'))
      })
    })

    it('should dispatch import error if the gist configuration.json is over 10mb as it can only be fetched via git cloning', function () {
      send.resolves({
        files: {
          'configuration.json': {
            content: '{}',
            truncated: true,
            size: 10485761
          }
        }
      })
      return testThunk(restoreFromGitHub('some-id')).then(() => {
        expect(importError).to.have.been.calledWithMatch(containsMessage('gist configuration.json file is too big to fetch without git cloning, size 10485761 bytes'))
      })
    })

    it('should fetch the gist configuration.json if it is truncated but under 10mb', function () {
      send.onFirstCall().resolves({
        files: {
          'configuration.json': {
            content: 'truncated-content',
            truncated: true,
            size: 10485759,
            raw_url: 'some-raw-url'
          }
        },
        description: 'some-description'
      })
      getTruncatedFile.returns('some-request')
      send.onSecondCall().resolves('some-raw-file-content')

      return testThunk(restoreFromGitHub('some-id')).then(() => {
        expect(gitHubSetDescription).to.have.been.calledWith('some-description')
        expect(getTruncatedFile).to.have.been.calledWith('some-raw-url')
        expect(send).to.have.been.calledWith('some-request')
        expect(importData).to.have.been.calledWith('some-raw-file-content')
      })
    })

    it('should dispatch import data on successful fetch of the gist', function () {
      send.resolves(validResponse)
      return testThunk(restoreFromGitHub('irrelevant')).then(() => {
        expect(gitHubSetDescription).to.have.been.calledWith('some-description')
        expect(importData).to.have.been.calledWith('some-content')
      })
    })
  })

  describe('uploadToGitHub', function () {

    it('should dispatch exporting action', function () {
      send.resolves({id: 'some-id'})
      return testThunk(uploadToGitHub('irrelevant', 'irrelevant', 'irrelevant', 'irrelevant')).then(() => {
        expect(exporting).to.have.been.called()
      })
    })

    it('should dispatch export error action if the gist can not be created', function () {
      send.rejects({message: 'some-error'})
      return testThunk(uploadToGitHub('irrelevant', 'irrelevant', 'irrelevant', 'not-blank')).then(() => {
        expect(exportError).to.have.been.calledWithMatch(containsMessage('Unable to upload to GitHub because of an error: some-error'))
      })
    })

    it('should dispatch export error action if access token is blank', function () {
      return testThunk(uploadToGitHub('irrelevant', 'irrelevant', 'irrelevant', '')).then(() => {
        expect(exportError).to.have.been.calledWithMatch(containsOnlyMessage('You must provide an access token to upload to GitHub'))
      })
    })

    it('should create a gist if no ID is given', function () {
      send.resolves({id: 'irrelevant'})
      return testThunk(uploadToGitHub(null, 'some-description', 'some-config', 'some-token')).then(() => {
        expect(updateGist).to.not.have.been.called()
        expect(createGist).to.have.been.called('some-description', 'some-config', 'some-token')
      })
    })

    it('should create a gist if a blank ID is given', function () {
      send.resolves({id: 'irrelevant'})
      return testThunk(uploadToGitHub(' ', 'some-description', 'some-config', 'some-token')).then(() => {
        expect(updateGist).to.not.have.been.called()
        expect(createGist).to.have.been.called('some-description', 'some-config', 'some-token')
      })
    })

    it('should update the gist if an id is given', function () {
      send.resolves({id: 'irrelevant'})
      return testThunk(uploadToGitHub('some-id', 'some-description', 'some-config', 'some-token')).then(() => {
        expect(updateGist).to.have.been.called('some-id', 'some-description', 'some-config', 'some-token')
        expect(createGist).to.not.have.been.called()
      })
    })

    it('should dispatch export success on successful create of the gist', function () {
      send.resolves({id: 'some-id'})
      return testThunk(uploadToGitHub(null, 'irrelevant', 'irrelevant', 'not-blank')).then(() => {
        expect(exportSuccess).to.have.been.calledWithMatch(containsOnlyMessage('created gist some-id'))
      })
    })

    it('should dispatch export success on successful update of the gist', function () {
      send.resolves({id: 'some-id'})
      return testThunk(uploadToGitHub('irrelevant', 'irrelevant', 'irrelevant', 'not-blank')).then(() => {
        expect(exportSuccess).to.have.been.calledWithMatch(containsOnlyMessage('updated gist some-id'))
      })
    })

    it('should dispatch GitHub set ID with the response ID on successful create/update of the gist', function () {
      send.resolves({id: 'some-id'})
      return testThunk(uploadToGitHub('irrelevant', 'irrelevant', 'irrelevant', 'not-blank')).then(() => {
        expect(gitHubSetGistId).to.have.been.calledWith('some-id')
      })
    })
  })
})
