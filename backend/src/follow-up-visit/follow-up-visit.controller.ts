// src/follow-up-visit/follow-up-visit.controller.ts
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
import { FollowUpVisitService } from "./follow-up-visit.service";
import { CreateFollowUpVisitDto } from "./dto/create-follow-up-visit.dto";
import { UpdateFollowUpVisitDto } from "./dto/update-follow-up-visit.dto";

@Controller("follow-up-visits")
export class FollowUpVisitController {
  constructor(private readonly followUpVisitService: FollowUpVisitService) {}

  @Post()
  create(@Body() dto: CreateFollowUpVisitDto) {
    return this.followUpVisitService.create(dto);
  }

  @Get()
  findAll(
    @Query("skip", ParseIntPipe) skip = 0,
    @Query("limit", ParseIntPipe) limit = 10,
  ) {
    return this.followUpVisitService.findAll(skip, limit);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.followUpVisitService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateFollowUpVisitDto) {
    return this.followUpVisitService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.followUpVisitService.remove(id);
  }

  @Get("search")
  search(
    @Query("q") query: string,
    @Query("skip", ParseIntPipe) skip = 0,
    @Query("limit", ParseIntPipe) limit = 10,
  ) {
    return this.followUpVisitService.search(query, skip, limit);
  }
}
