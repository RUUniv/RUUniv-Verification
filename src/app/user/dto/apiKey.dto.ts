import { ApiKey } from './../../../../node_modules/.prisma/client/index.d';
/**
 *  Response
 */

import { ApiProperty } from "@nestjs/swagger";

export class ApiKeyResponse{
    @ApiProperty({
        description: '인증용 apiKey',
        example: 'asd-asd...',
    })
    apiKey : string

}