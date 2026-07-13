import { AppointmentScheduler }
from "../scheduler/appointmentScheduler";

import { autoCompleteAppointmentsUseCase }
from "./appointmentUsecases";

export const appointmentScheduler =
  new AppointmentScheduler(
    autoCompleteAppointmentsUseCase
  );