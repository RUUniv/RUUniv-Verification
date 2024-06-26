import { NotFoundException } from '@nestjs/common';

export class UserNotFoundError extends Error {
  constructor() {
    super('USER_NOT_FOUND');
  }
}

// ===================================================================
// HTTP Exceptions
// ===================================================================
export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('USER_NOT_FOUND');
  }
}
