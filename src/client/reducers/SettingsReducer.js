import Immutable from 'immutable'
import {
  BROKEN_BUILD_SOUND_FX,
  IMPORT_SUCCESS,
  INITIALISED,
  PLAY_BROKEN_BUILD_SOUND_FX,
  REFRESH_TIME,
  REQUESTING_SYSTEM_NOTIFICATION_PERMISSION,
  SET_MAX_PROJECTS,
  SHOW_BROKEN_BUILD_TIME,
  SHOW_BUILD_LABEL,
  SHOW_BUILD_TIME,
  SHOW_SYSTEM_NOTIFICATIONS,
  SHOW_TRAY_NAME,
  SYSTEM_NOTIFICATIONS_PERMISSION_DENIED
} from '../actions/Actions'
import {DEFAULT_PROJECTS_TO_SHOW, MIN_REFRESH_TIME} from '../actions/SettingsActionCreators'
import defaultSoundFx from '../settings/pacman_death.mp3'

const DEFAULT_STATE = Immutable.Map({
  showTrayName: false,
  showBuildTime: true,
  showBrokenBuildTime: true,
  playBrokenBuildSoundFx: false,
  brokenBuildSoundFx: defaultSoundFx,
  refreshTime: MIN_REFRESH_TIME,
  showBuildLabel: false,
  showSystemNotifications: false,
  systemNotificationRequestingPermission: false,
  systemNotificationPermissionDenied: false,
  maxProjectsToShow: DEFAULT_PROJECTS_TO_SHOW
})

export function reduce(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case INITIALISED:
    case IMPORT_SUCCESS:
      return state.merge(action.data.get('audioVisual'))

    case SHOW_BUILD_TIME:
      return state.set('showBuildTime', action.value)

    case SHOW_BROKEN_BUILD_TIME:
      return state.set('showBrokenBuildTime', action.value)

    case PLAY_BROKEN_BUILD_SOUND_FX:
      return state.set('playBrokenBuildSoundFx', action.value)

    case BROKEN_BUILD_SOUND_FX:
      return state.set('brokenBuildSoundFx', action.value)

    case SHOW_TRAY_NAME:
      return state.set('showTrayName', action.value)

    case REFRESH_TIME:
      return state.set('refreshTime', action.value)

    case SHOW_BUILD_LABEL:
      return state.set('showBuildLabel', action.value)

    case SHOW_SYSTEM_NOTIFICATIONS:
      return state.withMutations((map) => map
        .set('showSystemNotifications', action.value)
        .set('systemNotificationPermissionDenied', false)
        .set('systemNotificationRequestingPermission', false))

    case REQUESTING_SYSTEM_NOTIFICATION_PERMISSION:
      return state.set('systemNotificationRequestingPermission', true)

    case SYSTEM_NOTIFICATIONS_PERMISSION_DENIED:
      return state.withMutations((map) => map
        .set('systemNotificationPermissionDenied', true)
        .set('systemNotificationRequestingPermission', false))

    case SET_MAX_PROJECTS:
      return state.set('maxProjectsToShow', action.value)

    default:
      return state
  }
}
