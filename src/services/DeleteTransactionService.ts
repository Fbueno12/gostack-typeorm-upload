import AppError from '../errors/AppError';

import { getCustomRepository } from "typeorm";
import TransactionsRepository from "../repositories/TransactionsRepository";

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionExists = await transactionsRepository.findOne({
      where: { id }
    })

    if(!transactionExists){
      throw new AppError("This ID didnt match with any of transactions!")
    }

    const deleteTransaction = await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
