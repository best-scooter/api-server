/**
 * Miscellaneous shared classes go here.
 */

import HttpStatusCodes from '../constants/HttpStatusCodes';


/**
 * Error with status code and message
 */
export class RouteError extends Error {

  public status: HttpStatusCodes;

  public constructor(status: HttpStatusCodes, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Error to use when OAuth requests fail
 */

export class OAuthError extends Error {
  public constructor(message: string) {
    super(message);
  }
}

/**
 * Error to use when JWT creation fail
 */

export class JWTError extends Error {
  public constructor(message: string) {
    super(message);
  }
}
