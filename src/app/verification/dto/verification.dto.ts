import { ApiProperty } from '@nestjs/swagger';

export class StudentReponse {
  constructor(data: StudentReponse) {
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
