import { IEventBus } from "@application/interfaces/IEventBus";

export class InMemoryEventBus implements IEventBus {
  private handlers: Map<string, Array<(event: any) => Promise<void>>> = new Map();

  async publish(event: any): Promise<void> {
    const eventName = event.constructor.name;
    const eventHandlers = this.handlers.get(eventName);

    if (eventHandlers) {
      // Execute all handlers concurrently or sequentially as needed
      // it concurrently to not block the main flow
      await Promise.all(
        eventHandlers.map((handler) =>
          handler(event).catch((error) => {
            console.error(`Error in event handler for ${eventName}:`, error);
          })
        )
      );
    }
  }

  subscribe(eventName: string, handler: (event: any) => Promise<void>): void {
    const eventHandlers = this.handlers.get(eventName) || [];
    eventHandlers.push(handler);
    this.handlers.set(eventName, eventHandlers);
  }
}
