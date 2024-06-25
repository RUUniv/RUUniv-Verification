import { Module } from '@nestjs/common';
import { StudentService } from './service/student.service';
import { StudentController } from './api/student.controller';

@Module({
  providers: [StudentService],
  controllers: [StudentController]
})
export class StudentModule {}
