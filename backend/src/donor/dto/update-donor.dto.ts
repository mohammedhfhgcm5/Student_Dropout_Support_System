// src/donor/dto/update-donor.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateDonorDto } from "./create-donor.dto";

export class UpdateDonorDto extends PartialType(CreateDonorDto) {}
