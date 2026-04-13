import { Slot } from "../entities/Slot";
import { Appointment } from "../entities/Appointment";
import { AppointmentStatus } from "../enums/AppointmentStatus";

export class SlotAvailabilityService {
  /**
   *  Filter booked slots
   *   determining availability based on existing appointments.
   */
  filterAvailableSlots(allSlots: Slot[], appointments: Appointment[]): Slot[] {
    const activeAppointmentStatuses = [
      AppointmentStatus.CONFIRMED,
      AppointmentStatus.PAYMENT_PENDING,
    ];

    return allSlots.filter((slot) => {
      const isBooked = appointments.some((appointment) => {
        return (
          appointment.getDate() === slot.date &&
          appointment.getStartTime() === slot.startTime &&
          activeAppointmentStatuses.includes(appointment.getStatus())
        );
      });

      return !isBooked;
    });
  }

  /**
   *  Attach booking status to slots
   */
  mapSlotsWithBookings(allSlots: Slot[], appointments: Appointment[]): any[] {
    return allSlots.map((slot) => {
      const booked = appointments.find((appointment) => {
        return (
          appointment.getDate() === slot.date &&
          appointment.getStartTime() === slot.startTime &&
          appointment.getStatus() !== AppointmentStatus.CANCELLED
        );
      });

      return {
        _id: slot.scheduleId,
        id: slot.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: !!booked,
      };
    });
  }

  /**
   * unify slots across multiple schedules
   */
  deduplicateSlots(slots: Slot[]): Slot[] {
    return slots.filter(
      (slot, index, self) =>
        index === self.findIndex((s) => s.equals(slot))
    );
  }
}
