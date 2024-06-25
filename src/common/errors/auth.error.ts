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

// ===================================================================
// HTTP Exceptions
// ===================================================================
export class TooManyPhoneAuthRequestsException extends HttpException {
  constructor() {
    super('TOO_MANY_PHONE_OTP_REQUEST', HttpStatus.TOO_MANY_REQUESTS);
  }
}

export class DuplicatedEmailException extends ConflictException {
  constructor() {
    super('DUPLICATED_EMAIL');
  }
}

export class InvalidPasswordException extends UnauthorizedException {
  constructor() {
    super('UN_AUTHORIZED', 'PAASWORD_IS_INVALID');
  }
}
