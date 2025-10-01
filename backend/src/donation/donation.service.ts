// src/donation/donation.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateDonationDto } from "./dto/create-donation.dto";
import { UpdateDonationDto } from "./dto/update-donation.dto";

@Injectable()
export class DonationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDonationDto) {
    return this.prisma.donation.create({ data: dto });
  }

  async findAll(skip = 0, limit = 10) {
    return this.prisma.donation.findMany({
      include: { student: true, donor: true, purpose: true },
      skip,
      take: limit,
    });
  }

  async findOne(id: number) {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      include: { student: true, donor: true, purpose: true },
    });
    if (!donation) {
      throw new NotFoundException(`Donation with ID ${id} not found`);
    }
    return donation;
  }

  async update(id: number, dto: UpdateDonationDto) {
    return this.prisma.donation.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.donation.delete({ where: { id } });
  }

  async search(query: string, skip = 0, limit = 10) {
    return this.prisma.donation.findMany({
      where: {
        OR: [
          { student: { fullName: { contains: query, mode: "insensitive" } } },
          { donor: { name: { contains: query, mode: "insensitive" } } },
          { purpose: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: { student: true, donor: true, purpose: true },
      skip,
      take: limit,
    });
  }


  
  // التقرير المالي الكلي
  async financialReport() {
    // إجمالي التبرعات وعددها
    const totalDonations = await this.prisma.donation.aggregate({
      _sum: { amount: true },
      _count: { id: true },
    });

    // التبرعات حسب الهدف (DonationPurpose)
    const byPurpose = await this.prisma.donationPurpose.findMany({
      include: {
        donations: true,
      },
    });

    const purposesReport = byPurpose.map(p => {
      const total = p.donations.reduce((sum, d) => sum + d.amount, 0);
      return {
        purposeId: p.id,
        purposeName: p.name,
        totalAmount: total,
        donationsCount: p.donations.length,
      };
    });

    return {
      totalAmount: totalDonations._sum.amount || 0,
      totalDonations: totalDonations._count.id,
      purposes: purposesReport,
    };
  }

  // التقرير المالي الشهري
  async monthlyFinancialReport(year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const monthlyDonations = await this.prisma.donation.findMany({
      where: { createdAt: { gte: start, lt: end } },
    });

    const totalAmount = monthlyDonations.reduce((sum, d) => sum + d.amount, 0);

    return {
      month,
      year,
      totalDonations: monthlyDonations.length,
      totalAmount,
    };
  }


   // احصاء التبرعات حسب الطالب
  async donationsByStudent() {
    const students = await this.prisma.student.findMany({
      include: {
        donations: true,
      },
    });

    const report = students.map(student => {
      const totalAmount = student.donations.reduce((sum, d) => sum + d.amount, 0);
      const donationsCount = student.donations.length;

      return {
        studentId: student.id,
        studentName: student.fullName,
        donationsCount,
        totalAmount,
      };
    });

    return report;
  }


  
  // احصاء التبرعات لطالب واحد
  async donationsByStudentId(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { donations: true },
    });

    if (!student) return null;

    const totalAmount = student.donations.reduce((sum, d) => sum + d.amount, 0);
    const donationsCount = student.donations.length;

    return {
      studentId: student.id,
      studentName: student.fullName,
      donationsCount,
      totalAmount,
      donations: student.donations, // لو تحب تعرض كل التبرعات بالتفصيل
    };
  }
}
