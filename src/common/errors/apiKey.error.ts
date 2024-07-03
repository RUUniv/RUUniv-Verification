import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

export class ApiKeyNotFoundError extends Error {
  constructor() {
    super('API_KEY_NOT_FOUND');
  }
}

export class InvalidApiKeyError extends Error {
  constructor() {
    super('INVALID_API_KEY');
  }
}

export class ToManyApiKeyError extends Error {
  constructor() {
    super('TO_MANY_API_KEY');
  }
}

// ===================================================================
// HTTP Exceptions
// ===================================================================
export class ApiKeyNotFoundException extends NotFoundException {
  constructor() {
    super('API KEY NOT FOUND');
  }
}

export class InvalidApiKeyException extends HttpException {
  constructor() {
    super('INVALID API KEY', HttpStatus.BAD_REQUEST);
  }
}

export class NullApiKeyException extends NotFoundException {
  constructor() {
    super('NULL API KEY');
  }
}

export class ToManyApiKeyException extends HttpException {
  constructor() {
    super('TO_MANY_API_KEY', HttpStatus.BAD_REQUEST);
  }
}
