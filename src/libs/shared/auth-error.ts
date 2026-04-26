export class UserNotFound extends Error {
  constructor(public username: string) {
    super(`User with username '${username}' not found.`);
  }
}

export class InvalidCredentials extends Error {}
