import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder('games')
      .select('games')
      .where('games.title ILIKE :term', { term: `%${param}%` })
      .getMany()

    return games
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const gamesCount = await this.repository.query('SELECT COUNT(*) FROM games')

    return gamesCount
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await this.repository
      .createQueryBuilder('games')
      .where('games.id = :id', { id: id })
      .relation(Game, 'users')
      .of(id)
      .loadMany()

    return users
  }
}
