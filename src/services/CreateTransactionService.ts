import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({title, type, value, category}: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository   = getRepository(Category);

    if(type != 'income' && type != 'outcome') {
      throw new AppError('type must be income or outcome!');
    }
    if(type === 'outcome') {

      const canOutcome = await transactionsRepository.getBalance();

      if(canOutcome.total - value < 0) {
        throw new AppError('Outcome cannot be minor than your total amount!');
      }
    }


    let categoryExists = await categoriesRepository.findOne({
      where: {title: category}
    })

    if(!categoryExists) {
      categoryExists = await categoriesRepository.create({
        title: category
      });

      await categoriesRepository.save(categoryExists);
    }

    const newTransaction = await transactionsRepository.create({
      title,
      type,
      value,
      category: categoryExists
    });

    await transactionsRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
