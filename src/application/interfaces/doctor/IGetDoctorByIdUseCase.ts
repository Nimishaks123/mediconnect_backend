export interface IGetDoctorByIdUseCase {

  execute(id: string): Promise<any>;

}