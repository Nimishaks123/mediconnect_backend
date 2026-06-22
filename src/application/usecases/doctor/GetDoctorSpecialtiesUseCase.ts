import { StatusCode } from "@common/enums";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
export class GetDoctorSpecialtiesUseCase{
    constructor(private readonly doctorRepo:IDoctorRepository){}
    async execute():Promise<string[]>{
        return await this.doctorRepo.findDistinctSpecialties();
    }

    


}