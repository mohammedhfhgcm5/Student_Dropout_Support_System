import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { GuardianInteractionService } from "./guardian-interaction.service";
import { CreateGuardianInteractionDto } from "./dto/create-guardian-interaction.dto";
import { UpdateGuardianInteractionDto } from "./dto/update-guardian-interaction.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { currentUser } from "src/auth/decorator/current.user.decorator";
import { PayloadDto } from "src/auth/dto/auth.dto";

@Controller("guardian-interactions")
@UseGuards(JwtAuthGuard)
export class GuardianInteractionController {
  constructor(private readonly service: GuardianInteractionService) {}

  // 🟢 إنشاء تفاعل جديد
  @Post()
  create(@Body() dto: CreateGuardianInteractionDto, @currentUser() user: PayloadDto) {
    return this.service.create(dto, user);
  }

  // 🔵 جميع التفاعلات
  @Get()
  findAll(
    @Query("skip", ParseIntPipe) skip = 0,
    @Query("limit", ParseIntPipe) limit = 20
  ) {
    return this.service.findAll(skip, limit);
  }

  // 🟠 حسب الطالب
  @Get("student/:studentId")
  findByStudent(@Param("studentId", ParseIntPipe) studentId: number) {
    return this.service.findByStudent(studentId);
  }

  // 🟣 حسب ولي الأمر
  @Get("guardian/:guardianId")
  findByGuardian(@Param("guardianId", ParseIntPipe) guardianId: number) {
    return this.service.findByGuardian(guardianId);
  }

  // 🟢 تعديل تفاعل
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateGuardianInteractionDto,
    @currentUser() user: PayloadDto
  ) {
    return this.service.update(id, dto, user);
  }

  // 🔴 حذف تفاعل
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
