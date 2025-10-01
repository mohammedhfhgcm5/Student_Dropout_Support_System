// src/guardian/guardian.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateGuardianDto } from "./dto/create-guardian.dto";
import { UpdateGuardianDto } from "./dto/update-guardian.dto";

@Injectable()
export class GuardianService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGuardianDto) {
    return this.prisma.guardian.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.guardian.findMany({
      include: { students: true },
    });
  }

  async findOne(id: number) {
    const guardian = await this.prisma.guardian.findUnique({
      where: { id },
      include: { students: true },
    });
    if (!guardian) {
      throw new NotFoundException(`Guardian with ID ${id} not found`);
    }
    return guardian;
  }

  async update(id: number, dto: UpdateGuardianDto) {
    return this.prisma.guardian.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.guardian.delete({
      where: { id },
    });
  }

  async search(query: string) {
  return this.prisma.guardian.findMany({
    where: {
      OR: [
        { nationalNumber: { equals: query } },
        { email: { equals: query, mode: "insensitive" } },
        { phone: { equals: query } },
        { fullName: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { students: true },
  });
}
}
