import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateGuardianInteractionDto } from "./dto/create-guardian-interaction.dto";
import { UpdateGuardianInteractionDto } from "./dto/update-guardian-interaction.dto";
import { PayloadDto } from "src/auth/dto/auth.dto";
import { ActivityLogService } from "src/activity-log/activity-log.service";

@Injectable()
export class GuardianInteractionService {
  constructor(private prisma: PrismaService,
    private activityLogService: ActivityLogService,
  ) {}

  // ✅ إنشاء تفاعل جديد
  async create(dto: CreateGuardianInteractionDto, user: PayloadDto) {

     if (!user?.id) {
    throw new Error('User ID is missing in payload');
  }
    const guardian= await this.prisma.guardianInteraction.create({
      data: {

        studentId: dto.studentId,
        guardianId: dto.guardianId,
        userId: user.id,
        interactionType: dto.interactionType,
        date: dto.date ? new Date(dto.date) : new Date(),
        notes: dto.notes,
      },
      include: {
        student: true,
        guardian: true,
        user: { select: { fullName: true, email: true, role: true } },
      },
    });


     await this.activityLogService.create({
        userId: user.id,
        action: 'CREATE_GuardianInteraction',
        description: `User ${user.email} and ID : ${user.id} create GuardianInteraction ID : ${guardian.id}  `,
      } as any); 


    return guardian;
  }

  // ✅ جلب كل التفاعلات
  async findAll(skip = 0, limit = 20) {
    return this.prisma.guardianInteraction.findMany({
      skip,
      take: limit,
      include: {
        student: true,
        guardian: true,
        user: true,
      },
      orderBy: { date: "desc" },
    });
  }

  // ✅ جلب تفاعلات طالب معيّن
  async findByStudent(studentId: number) {
    return this.prisma.guardianInteraction.findMany({
      where: { studentId },
      include: {
        guardian: true,
        user: true,
      },
      orderBy: { date: "desc" },
    });
  }

  // ✅ جلب تفاعلات ولي أمر معيّن
  async findByGuardian(guardianId: number) {
    return this.prisma.guardianInteraction.findMany({
      where: { guardianId },
      include: {
        student: true,
        user: true,
      },
      orderBy: { date: "desc" },
    });
  }

  // ✅ تحديث تفاعل
  async update(id: number, dto: UpdateGuardianInteractionDto, user: PayloadDto) {
    const Update = await this.prisma.guardianInteraction.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
        userId: user.id,
      },
    });


    await this.activityLogService.create({
        userId: user.id,
        action: 'UPDATE_GuardianInteraction',
        description: `User ${user.email} and ID : ${user.id} create GuardianInteraction ID : ${ Update.id} `,
      } as any); 

      return Update;
  }

  // ✅ حذف تفاعل
  async remove(id: number) {
    return this.prisma.guardianInteraction.delete({
      where: { id },
    });
  }
}
