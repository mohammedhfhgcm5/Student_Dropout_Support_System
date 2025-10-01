// src/location/location.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLocationDto) {
    return this.prisma.location.create({ data: dto });
  }

  async findAll() {
    return this.prisma.location.findMany({
      include: { students: true },
    });
  }

  async findOne(id: number) {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: { students: true },
    });
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async update(id: number, dto: UpdateLocationDto) {
    return this.prisma.location.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.location.delete({ where: { id } });
  }

  async search(query: string, skip = 0, limit = 10) {
    return this.prisma.location.findMany({
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
