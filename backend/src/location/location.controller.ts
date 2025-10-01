// src/location/location.controller.ts
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
import { LocationService } from "./location.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";

@Controller("locations")
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  create(@Body() dto: CreateLocationDto) {
    return this.locationService.create(dto);
  }

  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.locationService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.locationService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.locationService.remove(id);
  }

  @Get("search")
  search(
    @Query("q") query: string,
    @Query("skip", ParseIntPipe) skip = 0,
    @Query("limit", ParseIntPipe) limit = 10,
  ) {
    return this.locationService.search(query, skip, limit);
  }
}
