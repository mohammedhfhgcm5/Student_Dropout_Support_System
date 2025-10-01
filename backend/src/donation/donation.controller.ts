// src/donation/donation.controller.ts
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
import { DonationService } from "./donation.service";
import { CreateDonationDto } from "./dto/create-donation.dto";
import { UpdateDonationDto } from "./dto/update-donation.dto";

@Controller("donations")
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  create(@Body() dto: CreateDonationDto) {
    return this.donationService.create(dto);
  }

  @Get()
  findAll(
    @Query("skip", ParseIntPipe) skip = 0,
    @Query("limit", ParseIntPipe) limit = 10,
  ) {
    return this.donationService.findAll(skip, limit);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.donationService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateDonationDto) {
    return this.donationService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.donationService.remove(id);
  }

  @Get("search")
  search(
    @Query("q") query: string,
    @Query("skip", ParseIntPipe) skip = 0,
    @Query("limit", ParseIntPipe) limit = 10,
  ) {
    return this.donationService.search(query, skip, limit);
  }


   @Get("report/financial")
  financialReport() {
    return this.donationService.financialReport();
  }

  @Get("report/financial/monthly")
  monthlyFinancialReport(
    @Query("year", ParseIntPipe) year: number,
    @Query("month", ParseIntPipe) month: number,
  ) {
    return this.donationService.monthlyFinancialReport(year, month);
  }


   @Get("report/by-student")
  donationsByStudent() {
    return this.donationService.donationsByStudent();
  }


   @Get("report/student")
  donationsByOneStudent(
    @Query("studentId", ParseIntPipe) studentId: number,
  ) {
    return this.donationService.donationsByStudentId(studentId);
  }
}
