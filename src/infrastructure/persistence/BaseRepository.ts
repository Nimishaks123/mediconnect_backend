import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";

/**
 * TDomain  → Domain Entity (User, Doctor, Admin, etc.)
 * TDb      → Persistence Model (UserDB, DoctorDB, etc.)
 */
export abstract class BaseRepository<
  TDomain,
  TDb extends Document
> {
  protected constructor(protected readonly model: Model<TDb>) {}

  /**
   * Convert DB object → Domain entity
   * NOTE: accepts Partial<TDb> because lean() removes Document methods
   */
  protected abstract toDomain(doc: Partial<TDb>): TDomain;

  /**
   * Convert Domain entity → DB object
   */
  protected abstract toPersistence(
    entity: TDomain
  ): Partial<TDb>;

  // ───────────────────────────────────────────────
  // CREATE
  // ───────────────────────────────────────────────
  async create(entity: TDomain): Promise<TDomain> {
    const created = await this.model.create(
      this.toPersistence(entity)
    );

    return this.toDomain(created.toObject());
  }

  // ───────────────────────────────────────────────
  // FIND ONE
  // ───────────────────────────────────────────────
  async findOne(
    filter: FilterQuery<TDb>
  ): Promise<TDomain | null> {
    const doc = await this.model
      .findOne(filter)
      .lean<Partial<TDb>>()
      .exec();

    return doc ? this.toDomain(doc) : null;
  }

  // ───────────────────────────────────────────────
  // FIND MANY
  // ───────────────────────────────────────────────
  async findMany(
    filter: FilterQuery<TDb> = {}
  ): Promise<TDomain[]> {
    const docs = await this.model
      .find(filter)
      .lean<Partial<TDb>[]>()
      .exec();

    return docs.map(doc => this.toDomain(doc));
  }

  // ───────────────────────────────────────────────
  // UPDATE
  // ───────────────────────────────────────────────
  async update(
    filter: FilterQuery<TDb>,
    update: UpdateQuery<TDb>
  ): Promise<TDomain | null> {
    const doc = await this.model
      .findOneAndUpdate(filter, update, {
        new: true,
        lean: true,
      })
      .exec();

    return doc ? this.toDomain(doc as Partial<TDb>) : null;
  }
}
