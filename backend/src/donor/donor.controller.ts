// src/donor/donor.controller.ts
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
import { DonorService } from "./donor.service";
import { CreateDonorDto } from "./dto/create-donor.dto";
import { UpdateDonorDto } from "./dto/update-donor.dto";

@Controller("donors")
export class DonorController {
  constructor(private readonly donorService: DonorService) {}

  @Post()
  create(@Body() dto: CreateDonorDto) {
    return this.donorService.create(dto);
  }

  @Get()
  findAll() {
    return this.donorService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.donorService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateDonorDto,
  ) {
    return this.donorService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.donorService.remove(id);
  }

  @Get("search")
  search(
    @Query("q") query: string,
    @Query("skip", ParseIntPipe) skip = 0,
    @Query("limit", ParseIntPipe) limit = 10,
  ) {
    return this.donorService.search(query, skip, limit);
  }
}
