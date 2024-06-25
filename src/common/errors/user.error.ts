import { NotFoundException } from '@nestjs/common';

export class NoUserError extends Error {
  constructor() {
    super('NO_USER');
  }
}

export class DuplicatedPhoneError extends Error {
  constructor() {
    super('DUPLICATED_PHONE');
  }
}

export class DuplicatedEmailError extends Error {
  constructor() {
    super('DUPLICATED_Email');
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
