export class PlatformSettings {
  constructor(
    private readonly id: string,
    private platformFee: number,
    private refundPercentage: number
  ) {}

  static create(): PlatformSettings {
    return new PlatformSettings(
      "",
      50, // default platform fee
      75  // default refund percentage
    );
  }

  static rehydrate(data: {
    id: string;
    platformFee: number;
    refundPercentage: number;
  }): PlatformSettings {
    return new PlatformSettings(
      data.id,
      data.platformFee,
      data.refundPercentage
    );
  }

  getId(): string {
    return this.id;
  }

  getPlatformFee(): number {
    return this.platformFee;
  }

  getRefundPercentage(): number {
    return this.refundPercentage;
  }

  update(data: {
    platformFee: number;
    refundPercentage: number;
  }) {
    this.platformFee = data.platformFee;
    this.refundPercentage = data.refundPercentage;
  }
}