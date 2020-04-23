// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'outcome' | 'income';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    let fetchCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    // criar uma nova categoria.
    if (!fetchCategory) {
      const newCategory = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(newCategory);
      fetchCategory = newCategory;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: fetchCategory.id,
    });

    await transactionRepository.save(transaction);

    transaction.category = fetchCategory;

    return transaction;
  }
}

export default CreateTransactionService;
