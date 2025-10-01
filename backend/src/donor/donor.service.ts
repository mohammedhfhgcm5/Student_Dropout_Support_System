// src/donor/donor.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateDonorDto } from "./dto/create-donor.dto";
import { UpdateDonorDto } from "./dto/update-donor.dto";

@Injectable()
export class DonorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDonorDto) {
    return this.prisma.donor.create({ data: dto });
  }

  async findAll() {
    return this.prisma.donor.findMany({
      include: { donations: true },
    });
  }

  async findOne(id: number) {
    const donor = await this.prisma.donor.findUnique({
      where: { id },
      include: { donations: true },
    });
    if (!donor) {
      throw new NotFoundException(`Donor with ID ${id} not found`);
    }
    return donor;
  }
  async findOnebyemail(email: string) {
    const donor = await this.prisma.donor.findUnique({
      where: { email },
      include: { donations: true },
    });
    if (!donor) {
      throw new NotFoundException(`Donor with email ${email} not found`);
    }
    return donor;
  }

  async update(id: number, dto: UpdateDonorDto) {
    return this.prisma.donor.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.donor.delete({ where: { id } });
  }

  async search(query: string, skip = 0, limit = 10) {
    return this.prisma.donor.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { nationalNumber: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { donations: true },
      skip,
      take: limit,
    });
  }
}
