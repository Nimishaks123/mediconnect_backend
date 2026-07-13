import cron from "node-cron";

import logger
from "@common/logger";

import { IAutoCompleteAppointmentsUseCase }
from "@application/interfaces/appointment/IAutoCompleteAppointmentsUseCase";

export class AppointmentScheduler {

  constructor(
    private readonly autoCompleteAppointmentsUseCase:
      IAutoCompleteAppointmentsUseCase
  ) {}

  start(): void {

    cron.schedule("* * * * *", async () => {

      try {

        const completed =
          await this.autoCompleteAppointmentsUseCase.execute();

        if (completed > 0) {

          logger.info(
            `${completed} appointment(s) auto-completed successfully`
          );
        }

      } catch (error) {

        logger.error(
          "Appointment scheduler execution failed",
          error
        );
      }

    });

    logger.info(
      "Appointment scheduler started"
    );
  }
}