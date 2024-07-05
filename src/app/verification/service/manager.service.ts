import { Injectable } from '@nestjs/common';
import { Student } from '@prisma/client';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { RegistryStudentRequest } from '../dto/manager.dto';

@Injectable()
export class ManagerService {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async getVerifiedStudents(apiKeyId: bigint): Promise<Student[]> {
    return this.dataBaseService.student.findMany({
      where: {
        apiKeyId: apiKeyId,
      },
    });
  }
  async deleteVerifiedStudent(
    apiKeyId: bigint,
    studentId: bigint,
  ): Promise<boolean> {
    await this.dataBaseService.student.delete({
      where: { apiKeyId: apiKeyId, id: studentId },
    });

    return true;
  }

  async registryStudent(apiKeyId: bigint, data: RegistryStudentRequest) {
    return this.dataBaseService.student.create({
      data: {
        universityName: data.universityName,
        email: data.email,
        apiKeyId: apiKeyId,
      },
    });
  }
}
