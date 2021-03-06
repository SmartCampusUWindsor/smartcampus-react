import { error } from 'react-notification-system-redux';

import api from './api';

/**
 * Refs
 * https://redux.js.org/basics/actions
 * https://www.npmjs.com/package/redux-promise-middleware
 */

/*
 * Action Types
 */

export const FETCH_EVENT = 'FETCH_EVENT';
export const ADD_EVENT = 'ADD_EVENT';
export const POST_EVENT = 'POST_EVENT';
export const LIKE_EVENT = 'LIKE_EVENT';
export const UNLIKE_EVENT = 'UNLIKE_EVENT';
export const ATTEND_EVENT = 'ATTEND_EVENT';
export const UNATTEND_EVENT = 'UNATTEND_EVENT';
export const COMMENT_EVENT = 'COMMENT_EVENT';
export const COMMENT_EVENT_UPDATE = 'COMMENT_EVENT_UPDATE';

export const DELETE_COMMENT = 'DELETE_COMMENT';

export const FETCH_EVENTS = 'FETCH_EVENTS';
export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

/*
 * Synchronous Action Creators
 */

export function addEvent(event) {
  return {
    type: ADD_EVENT,
    event
  }
}

export function openModal(modalType) {
  return {
    type: OPEN_MODAL,
    modalType
  }
}

export function commentEventUpdate(body) {
  return {
    type: COMMENT_EVENT_UPDATE,
    body
  }
}

export function closeModal() {
  return {
    type: CLOSE_MODAL
  }
}

export function logout() {
  localStorage.clear();

  return {
    type: LOGOUT
  }
}

/*
 * Async Action Creators
 */

export function showError(title, message) {
  return dispatch => {
    dispatch(
      error({ title: title, message: message})
    );
  }
}

export function fetchEvents() {
  return {
    type: FETCH_EVENTS,
    payload: api.Event.feed()
  }
}

export function fetchEvent(id) {
  return {
    type: FETCH_EVENT,
    payload: api.Event.get(id)
  }
}

export function postEvent(title, timestamp, location, link, body) {
  return dispatch => {
    dispatch({ 
      type: POST_EVENT,
      payload: api.Event.create(title, timestamp, location, link, body)
    }).then(res => {
      dispatch({ type: CLOSE_MODAL });
    });
  }
}

export function likeEvent(id) {
  return {
    type: LIKE_EVENT,
    payload: api.Event.like(id)
  }
}

export function unlikeEvent(id) {
  return {
    type: UNLIKE_EVENT,
    payload: api.Event.unlike(id)
  }
}

export function attendEvent(id) {
  return {
    type: ATTEND_EVENT,
    payload: api.Event.attend(id)
  }
}

export function unattendEvent(id) {
  return {
    type: UNATTEND_EVENT,
    payload: api.Event.unattend(id)
  }
}

export function commentEvent(id, body) {
  return {
    type: COMMENT_EVENT,
    payload: api.Event.comment(id, body)
  }
}

export function deleteComment(id) {
  return dispatch => {
    dispatch({ 
      type: DELETE_COMMENT,
      payload: api.Comment.delete(id)
    }).then(res => {
      // intercept to pass the id with FULFILLED action
      // ref: https://stackoverflow.com/questions/42377954/pass-argument-through-action-to-reducer-with-promise-thunk
      dispatch({
        type: `${DELETE_COMMENT}_FULFILLED`,
        id: id
      }) 
    });
  }
}

export function fetchCurrentUser() {
  return dispatch => {
    dispatch({ 
      type: FETCH_CURRENT_USER,
      payload: api.User.current()
    }).then(res => {
      localStorage.setItem('token', res.value.body.user.token);
    });
  }
}

export function login(googleIDToken) {
  return dispatch => {
    // Call the API
    dispatch({ 
      type: LOGIN,
      payload: api.User.login(googleIDToken)
    }).then(res => {
      // Login successful, save the JWT
      localStorage.setItem('token', res.value.body.user.token);
    }).catch(err => {
      // Login failed, show an error message
      // TODO: Check for specific errors, instead of just relaying message.
      dispatch(
        error({ title: "Failed to log in", message: err.body.errors.message})
      );
    });
  }
}
