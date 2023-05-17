import request from 'umi-request';
import { loginRoute, createFavoriteRoute, registerRoute, allModeratorsRoute, createModeratorsRoute, createModeratorUsersRoute, getAllModeratorUsersRoute, allUsersRoute, updateAccountImage } from '../utils/APIRoutes.js';

export async function loginUser(credentials) {
    return request(`${loginRoute}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify(credentials),
    });
  }

export async function getAllUsers() {
  return request(`${allModeratorsRoute}/users`, {
    // return request(`${allUsersRoute}/users`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
  });
}


export async function getAllLovers() {
  return request(`${allUsersRoute}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
  });
}


export async function updateAccountServiceImage(body) {
  return request(`${updateAccountImage}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function getAllModerators() {
    return request(`${allModeratorsRoute}/users`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  export async function createModerator(body) {
    return request(`${createModeratorsRoute}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  export async function createModeratorUserService(body) {
    return request(`${createModeratorUsersRoute}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  export async function getAllModeratorUsers() {
    return request(`${getAllModeratorUsersRoute}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  export async function createFavorite(body) {
    return request(`${createFavoriteRoute}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }


export async function createUser(body) {
  return request(`${registerRoute}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}
