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
          appointment.getDate() === slot.getDate() &&
          appointment.getStartTime() === slot.getStartTime() &&
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
          appointment.getDate() === slot.getDate() &&
          appointment.getStartTime() === slot.getStartTime() &&
          appointment.getStatus() !== AppointmentStatus.CANCELLED
        );
      });

      const compositeId = `${slot.getScheduleId()}|${slot.getId()}`;
      return {
        _id: compositeId,
        id: slot.getId(),
        date: slot.getDate(),
        startTime: slot.getStartTime(),
        endTime: slot.getEndTime(),
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
