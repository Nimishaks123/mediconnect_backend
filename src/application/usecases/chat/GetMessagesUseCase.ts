import { Message } from "@domain/entities/Message";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { IMessageRepository } from "@domain/interfaces/IMessageRepository";

export interface GetMessagesDTO {
  conversationId: string;
  page?: number;
  limit?: number;
}

export class GetMessagesUseCase {
  constructor(private readonly messageRepo: IMessageRepository,
    private readonly appointmentRepo:IAppointmentRepository
  ) {}

  async execute(dto: GetMessagesDTO): Promise<Message[]> {
    const appointment=await this.appointmentRepo.findById(dto.conversationId);
    if(!appointment) return [];
    const appointments=await this.appointmentRepo.findByDoctorAndPatient(
      appointment.getDoctorId(),
      appointment.getPatientId()
    )
    const conversationIds=appointments.map((a)=>a.getId());
    return await this.messageRepo.findByConversationIds(conversationIds)
    
  }
}
