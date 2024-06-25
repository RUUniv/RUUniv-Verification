import { NotFoundException } from '@nestjs/common';

export class NoApiKeyError extends Error {
  constructor() {
    super('NO_API_KEY');
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
