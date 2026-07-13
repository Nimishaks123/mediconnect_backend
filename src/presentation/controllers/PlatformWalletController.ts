import {Request,Response} from "express";
import { catchAsync } from "@presentation/utils/catchAsync";
import { StatusCode } from "@common/enums";
import { IGetPlatformWalletUseCase }
from "@application/interfaces/platformWallet/IGetPlatformWalletUseCase";

import { IGetPlatformWalletTransactionsUseCase }
from "@application/interfaces/platformWallet/IGetPlatformWalletTransactionsUseCase";
export class PlatformWalletController{
    constructor(
        private readonly getPlatformWalletUseCase:IGetPlatformWalletUseCase,
        private readonly getPlatformTransactionUseCase:IGetPlatformWalletTransactionsUseCase
    ){}
    getWallet=catchAsync(
        async(req:Request,res:Response)=>{
            const wallet=await this.getPlatformWalletUseCase.execute();
            res.status(StatusCode.OK).json({
                success:true,
                data:wallet,
            })

        }
    );
    getTransactions=catchAsync(async(req:Request,res:Response)=>{
        const page=Number(req.query.page)||1;
        const limit=Number(req.query.limit)||10;
        const result=await this.getPlatformTransactionUseCase.execute({page,limit});
        res.status(StatusCode.OK).json({
            success:true,
            data:result,
        });

    });
}