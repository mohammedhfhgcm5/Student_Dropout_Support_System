// src/school/school.controller.ts
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
import { SchoolService } from "./school.service";
import { CreateSchoolDto } from "./dto/create-school.dto";
import { UpdateSchoolDto } from "./dto/update-school.dto";

@Controller("schools")
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  create(@Body() dto: CreateSchoolDto) {
    return this.schoolService.create(dto);
  }

  @Get()
  findAll() {
    return this.schoolService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.schoolService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateSchoolDto,
  ) {
    return this.schoolService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.schoolService.remove(id);
  }

@Get("search")
search(
  @Query("q") query: string,
  @Query("skip", ParseIntPipe) skip = 0,
  @Query("limit", ParseIntPipe) limit = 10,
) {
  return this.schoolService.search(query, skip, limit);
}
}
