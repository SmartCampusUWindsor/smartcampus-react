import { combineReducers } from 'redux'
import {
  POST_EVENT,
  FETCH_EVENTS,
  LOGIN,
  REGISTER,
  FETCH_CURRENT_USER,
  LOGOUT,
  OPEN_MODAL,
  CLOSE_MODAL
} from './actions'

/**
 * Refs
 * https://redux.js.org/basics/reducers
 * 
 * Reducers define how state is changed, given an action.
 * For ex. when user is logged in/out (action), we toggle currentUser (state)
 * When an action is dispatched in redux, these functions intercept.
 */

function eventFeed(state = {isFetching: false, events: []}, action) {
  switch (action.type) {
    case `${POST_EVENT}_FULFILLED`:
      return {
        ...state,
        events: [action.payload.body.event, ...state.events]
      };
    case `${FETCH_EVENTS}_PENDING`:
      return {
        ...state,
        isFetching: true,
      };
    case `${FETCH_EVENTS}_FULFILLED`:
      return {
        ...state,
        isFetching: false,
        events: action.payload.body.events
      };
    case `${FETCH_EVENTS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        errors: action.payload.body
      };
    default:
      return state
  }
}

function currentUser(state = null, action) {
  switch (action.type) {
    case `${LOGIN}_FULFILLED`:
    case `${REGISTER}_FULFILLED`:
    case `${FETCH_CURRENT_USER}_FULFILLED`:
      return action.payload.body.user;
    case LOGOUT:
      return null; // no user
    default:
      return state
  }
}

function modal(state = {type: null, show: false}, action) {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        type: action.modalType,
        show: true
      }
    case CLOSE_MODAL:
      return {
        ...state,
        show: false
      }
    default:
      return state
  }
}

export default combineReducers({
  currentUser, eventFeed, modal
})