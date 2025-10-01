// src/dropout-reason/dropout-reason.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateDropoutReasonDto } from "./dto/create-dropout-reason.dto";
import { UpdateDropoutReasonDto } from "./dto/update-dropout-reason.dto";

@Injectable()
export class DropoutReasonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDropoutReasonDto) {
    return this.prisma.dropoutReason.create({ data: dto });
  }

  async findAll() {
    return this.prisma.dropoutReason.findMany({
      include: { students: true },
    });
  }

  async findOne(id: number) {
    const reason = await this.prisma.dropoutReason.findUnique({
      where: { id },
      include: { students: true },
    });
    if (!reason) {
      throw new NotFoundException(`DropoutReason with ID ${id} not found`);
    }
    return reason;
  }

  async update(id: number, dto: UpdateDropoutReasonDto) {
    return this.prisma.dropoutReason.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.dropoutReason.delete({ where: { id } });
  }

  async search(query: string, skip = 0, limit = 10) {
    return this.prisma.dropoutReason.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { region: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { students: true },
      skip,
      take: limit,
    });
  }
}
