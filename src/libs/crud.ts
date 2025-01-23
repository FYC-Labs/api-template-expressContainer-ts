import { getPrismaClient } from './prismaClient';

const prisma = getPrismaClient();

class Crud {
  private model: any;

  constructor({ model }: any = {}) {
    this.model = model;
  }

  async getAll() {
    const transaction = await (prisma as any)[this.model].findMany();

    return transaction;
  }

  async create(data: any) {
    if (!data) throw new Error('{data} must be provided in create request.');

    const transaction = await (prisma as any)[this.model].create({ data });

    return transaction;
  }

  async update(id: number, data: any) {
    if (!data && !id)
      throw new Error('{data} and {id} must be provided in update request.');
    if (!data) throw new Error('{data} must be provided in update request.');
    // if (!id) throw new Error('{id} must be provided.');

    const transaction = await (prisma as any)[this.model].update({
      where: {
        id,
      },
      data,
    });

    return transaction;
  }

  async deleteById(id: number) {
    if (!id) {
      try {
        const transaction = await (prisma as any)[this.model].delete({
          where: { id },
        });

        return transaction;
      } catch (error) {
        throw new Error('{id} is required');
      }
    }

    const transaction = await (prisma as any)[this.model].delete({
      where: {
        id,
      },
    });

    return transaction;
  }

  async getByField(field: string, value: number | string) {
    if (!field || !value)
      throw new Error('{field} and {value} must be provided.');

    const valueIsNumber = Number(value);

    const val = Number.isNaN(valueIsNumber) ? value : valueIsNumber;

    const transaction = await (prisma as any)[this.model].findFirst({
      where: {
        [field]: val,
      },
    });

    return transaction;
  }
}

export { Crud };
