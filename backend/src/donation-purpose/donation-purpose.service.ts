// src/donation-purpose/donation-purpose.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateDonationPurposeDto } from "./dto/create-donation-purpose.dto";
import { UpdateDonationPurposeDto } from "./dto/update-donation-purpose.dto";

@Injectable()
export class DonationPurposeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDonationPurposeDto) {
    return this.prisma.donationPurpose.create({ data: dto });
  }

  async findAll() {
    return this.prisma.donationPurpose.findMany({
      include: { donations: true },
    });
  }

  async findOne(id: number) {
    const purpose = await this.prisma.donationPurpose.findUnique({
      where: { id },
      include: { donations: true },
    });
    if (!purpose) {
      throw new NotFoundException(`DonationPurpose with ID ${id} not found`);
    }
    return purpose;
  }

  async update(id: number, dto: UpdateDonationPurposeDto) {
    return this.prisma.donationPurpose.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.donationPurpose.delete({ where: { id } });
  }

  async search(query: string, skip = 0, limit = 10) {
    return this.prisma.donationPurpose.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
      include: { donations: true },
      skip,
      take: limit,
    });
  }
}
