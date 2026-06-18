import { Response } from "express";
import { ICreatePrescriptionUseCase } from "@application/interfaces/prescription/ICreatePrescriptionUseCase";
import { IGetPrescriptionUseCase } from "@application/interfaces/prescription/IGetPrescriptionUseCase";
import { StatusCode } from "@common/enums";
import { AuthenticatedRequest } from "@presentation/middlewares/authMiddleware";
import { catchAsync } from "@presentation/utils/catchAsync";
export class PrescriptionController{
    constructor(
        private readonly createPrescriptionUC:ICreatePrescriptionUseCase,
        private readonly getPrescriptionUC:IGetPrescriptionUseCase
    ){

    }
    create=catchAsync(async(req:AuthenticatedRequest,res:Response)=>{
        const prescriptionId=await this.createPrescriptionUC.execute({
            appointmentId:req.body.appointmentId,
            doctorId:req.user!.id,
            diagnosis:req.body.diagnosis,
            medicines:req.body.medicines,
            notes:req.body.notes

        });
        res.status(StatusCode.CREATED).json({
            success:true,
            prescriptionId
        })
    })
getPrescription=catchAsync(async(req:AuthenticatedRequest,res:Response)=>{
    const {appointmentId}=req.params;
    const result=await this.getPrescriptionUC.execute(appointmentId,req.user!.id,req.user!.role);
    res.status(StatusCode.OK).json({
        success:true,
        message:"Prescription fetched successfully",
        data:result
    })

    
})
}