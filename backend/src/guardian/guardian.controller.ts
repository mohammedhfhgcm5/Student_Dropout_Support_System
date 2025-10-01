// src/guardian/guardian.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { GuardianService } from "./guardian.service";
import { CreateGuardianDto } from "./dto/create-guardian.dto";
import { UpdateGuardianDto } from "./dto/update-guardian.dto";

@Controller("guardians")
export class GuardianController {
  constructor(private readonly guardianService: GuardianService) {}

  @Post()
  create(@Body() dto: CreateGuardianDto) {
    return this.guardianService.create(dto);
  }

  @Get()
  findAll() {
    return this.guardianService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.guardianService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateGuardianDto,
  ) {
    return this.guardianService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.guardianService.remove(id);
  }

  @Get("search")
search(@Query("q") query: string) {
  return this.guardianService.search(query);
}
}
