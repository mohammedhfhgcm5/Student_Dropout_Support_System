// src/school/school.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateSchoolDto } from "./dto/create-school.dto";
import { UpdateSchoolDto } from "./dto/update-school.dto";

@Injectable()
export class SchoolService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSchoolDto) {
    return this.prisma.school.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.school.findMany({
      include: { students: true },
    });
  }

  async findOne(id: number) {
    const school = await this.prisma.school.findUnique({
      where: { id },
      include: { students: true },
    });
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async update(id: number, dto: UpdateSchoolDto) {
    return this.prisma.school.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.school.delete({
      where: { id },
    });
  }


  
async search(query: string, skip = 0, limit = 10) {
  return this.prisma.school.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { region: { contains: query, mode: "insensitive" } },
        { address: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { students: true },
    skip,
    take: limit,
  });
}
}
