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
// ===================================================================
// HTTP Exceptions
// ===================================================================
export class ApiKeyNotFoundException extends NotFoundException {
  constructor() {
    super('API KEY NOT FOUND');
  }
}

export class InvalidApiKeyException extends NotFoundException {
  constructor() {
    super('INVALID API KEY');
  }
}

export class NullApiKeyException extends NotFoundException {
  constructor() {
    super('NULL API KEY');
  }
}
