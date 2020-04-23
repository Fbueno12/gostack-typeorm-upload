import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {

    const allTransactions = await this.find();

    const income = allTransactions
      .filter(transaction => transaction.type === 'income')
      .reduce((accumulator, transaction) => accumulator + Number(transaction.value), 0);

    const outcome = allTransactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((accumulator, transaction) => accumulator + Number(transaction.value), 0);

    return {
      income,
      outcome,
      total: income - outcome
    }
  }
}

export default TransactionsRepository;
