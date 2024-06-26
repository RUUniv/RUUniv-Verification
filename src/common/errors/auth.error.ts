import {
  ConflictException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

export class InvalidPasswordError extends Error {
  constructor() {
    super('INVALID_PASSWORD_ERROR');
  }
}

export class DuplicatedEmailError extends Error {
  constructor() {
    super('DUPLICATED_EMAIL');
  }
}

// ===================================================================
// HTTP Exceptions
// ===================================================================

export class DuplicatedEmailException extends HttpException {
  constructor() {
    super('DUPLICATED_EMAIL', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidPasswordException extends UnauthorizedException {
  constructor() {
    super('UN_AUTHORIZED', 'PAASWORD_IS_INVALID');
  }
}
