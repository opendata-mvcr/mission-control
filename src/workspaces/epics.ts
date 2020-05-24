import { combineEpics } from 'redux-observable'
import { merge, of } from 'rxjs'
import { map, switchMap, mapTo } from 'rxjs/operators'

import { Epic, Id } from 'app/types'
import Actions from 'app/actions'
import Routes from 'app/routes'
import { getJSON, postJSON, putJSON, del } from 'app/utils/ajax'
import { onRouteEnter, ofSafeType, mapError, fire } from 'app/utils/epic'

import { getWorkspacesUrl, getWorkspaceUrl } from './api'
import { WorkspaceData } from './types'
import getIdFromUri from 'app/utils/getIdFromUri'

const getDataOnRouteEnter: Epic = ($action) =>
  merge(
    onRouteEnter($action, Routes.WorkspacesList).pipe(
      mapTo(Actions.Workspaces.getWorkspaces.request())
    ),
    onRouteEnter($action, Routes.WorkspaceDetail).pipe(
      map(({ route }) =>
        Actions.Workspaces.getWorkspace.request(route.params.id)
      )
    )
  )

const getWorkspaces: Epic = ($action) =>
  $action.pipe(
    ofSafeType(Actions.Workspaces.getWorkspaces.request),
    switchMap(() =>
      getJSON(getWorkspacesUrl()).pipe(
        map((workspaces) => workspaces as WorkspaceData[]),
        map(Actions.Workspaces.getWorkspaces.success),
        mapError(Actions.Workspaces.getWorkspaces.failure)
      )
    )
  )

const getWorkspace: Epic = ($action) =>
  $action.pipe(
    ofSafeType(Actions.Workspaces.getWorkspace.request),
    switchMap(({ payload }) =>
      getJSON(getWorkspaceUrl(payload as Id)).pipe(
        map((workspace) => workspace as WorkspaceData),
        map(Actions.Workspaces.getWorkspace.success),
        mapError(Actions.Workspaces.getWorkspace.failure)
      )
    )
  )

const addWorkspace: Epic = ($action) =>
  $action.pipe(
    ofSafeType(Actions.Workspaces.addWorkspace.request),
    switchMap(({ payload }) =>
      postJSON(getWorkspacesUrl(), payload).pipe(
        mapTo(Actions.Workspaces.addWorkspace.success()),
        mapError(Actions.Workspaces.addWorkspace.failure)
      )
    )
  )

const actionsAfterAddWorkspace: Epic = ($action) =>
  merge(
    $action.pipe(
      ofSafeType(Actions.Workspaces.addWorkspace.success),
      fire(
        Actions.Snackbar.success('workspaces.addWorkspaceSuccess'),
        Actions.Workspaces.openAddWorkspaceForm(false),
        Actions.Workspaces.getWorkspaces.request()
      )
    ),
    $action.pipe(
      ofSafeType(Actions.Workspaces.addWorkspace.failure),
      fire(Actions.Snackbar.error('workspaces.addWorkspaceError'))
    )
  )

const editWorkspace: Epic = ($action) =>
  $action.pipe(
    ofSafeType(Actions.Workspaces.editWorkspace.request),
    switchMap(({ payload }) =>
      putJSON(getWorkspaceUrl(getIdFromUri(payload.uri)), payload).pipe(
        mapTo(Actions.Workspaces.editWorkspace.success(payload)),
        mapError(Actions.Workspaces.editWorkspace.failure)
      )
    )
  )

const actionsAfterEditWorkspace: Epic = ($action) =>
  merge(
    $action.pipe(
      ofSafeType(Actions.Workspaces.editWorkspace.success),
      switchMap(({ payload }) =>
        of(
          Actions.Snackbar.success('workspaces.editWorkspaceSuccess'),
          Actions.Workspaces.openEditWorkspaceForm(false),
          Actions.Workspaces.getWorkspace.request(getIdFromUri(payload.uri))
        )
      )
    ),
    $action.pipe(
      ofSafeType(Actions.Workspaces.editWorkspace.failure),
      fire(Actions.Snackbar.error('workspaces.editWorkspaceError'))
    )
  )

const deleteWorkspace: Epic = ($action) =>
  $action.pipe(
    ofSafeType(Actions.Workspaces.deleteWorkspace.request),
    switchMap(({ payload }) =>
      del(getWorkspaceUrl(getIdFromUri(payload.uri))).pipe(
        mapTo(Actions.Workspaces.deleteWorkspace.success(payload)),
        mapError(Actions.Workspaces.deleteWorkspace.failure)
      )
    )
  )

const actionsAfterDeleteWorkspace: Epic = ($action) =>
  merge(
    $action.pipe(
      ofSafeType(Actions.Workspaces.deleteWorkspace.success),
      switchMap(({ payload }) =>
        of(
          Actions.Snackbar.success('workspaces.deleteWorkspaceSuccess'),
          Actions.Workspaces.openDeleteWorkspaceForm(false),
          Actions.Router.navigateTo({ name: Routes.Workspaces })
        )
      )
    ),
    $action.pipe(
      ofSafeType(Actions.Workspaces.deleteWorkspace.failure),
      fire(Actions.Snackbar.error('workspaces.deleteWorkspaceError'))
    )
  )

export default combineEpics(
  getDataOnRouteEnter,
  getWorkspaces,
  getWorkspace,
  addWorkspace,
  actionsAfterAddWorkspace,
  editWorkspace,
  actionsAfterEditWorkspace,
  deleteWorkspace,
  actionsAfterDeleteWorkspace
)
