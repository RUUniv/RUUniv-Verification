import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

export class UniversityNotFoundError extends Error {
  constructor() {
    super('UNIVERSITY_NOT_FOUND');
  }
}

export class AuthCodeNotFoundError extends Error {
  constructor() {
    super('AUTH_CODE_NOT_FOUND');
  }
}

export class InvalidAuthCodeError extends Error {
  constructor() {
    super('INVALID_AUTH_CODE');
  }
}

export class DuplicatedVerificationError extends Error {
  constructor() {
    super('DUPLICATE_VERIFICATION');
  }
}

export class NotSupportedUniversityError extends Error {
  constructor() {
    super('NOT_SUPPORTED_UNIVERSITY');
  }
}
/**
 * HTTP EXCEPTION
 */

export class UniversityNotFoundException extends NotFoundException {
  constructor() {
    super('UNIVERSITY_NOT_FOUND');
  }
}

export class AuthCodeNotFoundException extends NotFoundException {
  constructor() {
    super('AUTH_CODE_NOT_FOUND');
  }
}

export class InvalidAuthCodeException extends NotFoundException {
  constructor() {
    super('INVALID_AUTH_CODE');
  }
}

export class DuplicatedVerificationException extends HttpException {
  constructor() {
    super('DUPLICATE_VERIFICATION', HttpStatus.BAD_REQUEST);
  }
}

export class NotSupportedUniversityException extends HttpException {
  constructor() {
    super('NOT_SUPPORTED_UNIVERSITY', HttpStatus.BAD_REQUEST);
  }
}
