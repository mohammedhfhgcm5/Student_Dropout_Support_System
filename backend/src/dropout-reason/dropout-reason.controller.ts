// src/dropout-reason/dropout-reason.controller.ts
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
} from "@nestjs/common";
import { DropoutReasonService } from "./dropout-reason.service";
import { CreateDropoutReasonDto } from "./dto/create-dropout-reason.dto";
import { UpdateDropoutReasonDto } from "./dto/update-dropout-reason.dto";

@Controller("dropout-reasons")
export class DropoutReasonController {
  constructor(private readonly dropoutReasonService: DropoutReasonService) {}

  @Post()
  create(@Body() dto: CreateDropoutReasonDto) {
    return this.dropoutReasonService.create(dto);
  }

  @Get()
  findAll() {
    return this.dropoutReasonService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.dropoutReasonService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateDropoutReasonDto,
  ) {
    return this.dropoutReasonService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.dropoutReasonService.remove(id);
  }

  @Get("search")
  search(
    @Query("q") query: string,
    @Query("skip", ParseIntPipe) skip = 0,
    @Query("limit", ParseIntPipe) limit = 10,
  ) {
    return this.dropoutReasonService.search(query, skip, limit);
  }
}
