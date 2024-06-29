import { ApiProperty } from '@nestjs/swagger';

/**
 * Response
 */

export class StudentResponse {
  constructor(data: StudentResponse) {
    this.id = data.id;
    this.email = data.email;
    this.universityName = data.universityName;
  }

  @ApiProperty({
    description: 'Student Id',
    example: '1',
  })
  id: bigint;

  @ApiProperty({
    description: '인증 완료된 이메일',
    example: 'email@naver.com',
  })
  email: string;

  @ApiProperty({
    description: '대학교',
    example: '서울시립대학교',
  })
  universityName: string;
}

export class DeleteStudentsResponse {
  constructor(data: DeleteStudentsResponse) {
    this.isDelete = data.isDelete;
  }

  @ApiProperty({
    description: '삭제 인증 상태',
    example: 'true',
  })
  isDelete: boolean;
}

export class SupportedUniversityResponse {
  constructor(data: SupportedUniversityResponse) {
    this.universityName = data.universityName;
    this.isSupported = data.isSupported;
  }

  @ApiProperty({
    description: '대학명',
    example: '서울시립대학교',
  })
  universityName: string;

  @ApiProperty({
    description: '대학 지원 여부',
    example: 'true',
  })
  isSupported: boolean;
}
