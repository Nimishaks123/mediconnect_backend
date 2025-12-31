// domain/interfaces/IBaseRepository.ts
export interface IBaseRepository<T> {
  create(entity: T): Promise<T>;
}
