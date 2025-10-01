// src/follow-up-visit/follow-up-visit.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateFollowUpVisitDto } from "./dto/create-follow-up-visit.dto";
import { UpdateFollowUpVisitDto } from "./dto/update-follow-up-visit.dto";

@Injectable()
export class FollowUpVisitService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFollowUpVisitDto) {
    return this.prisma.followUpVisit.create({ data: dto });
  }

  async findAll(skip = 0, limit = 10) {
    return this.prisma.followUpVisit.findMany({
      include: { student: true },
      skip,
      take: limit,
    });
  }

  async findOne(id: number) {
    const visit = await this.prisma.followUpVisit.findUnique({
      where: { id },
      include: { student: true },
    });
    if (!visit) {
      throw new NotFoundException(`FollowUpVisit with ID ${id} not found`);
    }
    return visit;
  }

  async update(id: number, dto: UpdateFollowUpVisitDto) {
    return this.prisma.followUpVisit.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.followUpVisit.delete({ where: { id } });
  }

  async search(query: string, skip = 0, limit = 10) {
    return this.prisma.followUpVisit.findMany({
      where: {
        OR: [
          { note: { contains: query, mode: "insensitive" } },
          { student: { fullName: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: { student: true },
      skip,
      take: limit,
    });
  }
}
