import { IUser } from '../interfaces/user';
import { logWithSeparator } from '../utils/log';
import pool from '../DB/db-connect';
import { QueryResult } from 'mysql2';

class UserModel {
  static async add({ name, email, password }: IUser) {
    try {
      const safeUserName = name || '';
      const safePassword = password || '';

      const sql = `INSERT INTO users(
        name, email, password)
        VALUES (?, ?, ?)
        `;

      const [result, _] = (await pool.query(sql, [
        safeUserName,
        email,
        safePassword,
      ])) as [IUser[], any];

      !!result.length &&
        logWithSeparator(
          `✅  User ${result[0].name} was added with id ${result[0].id}`,
          'green'
        );

      return !!result.length ? result[0] : null;
    } catch (err) {
      console.warn('Error adding user to DB:', err);
      return null;
    }
  }

  static async findByEmail(email: string) {
    try {
      const sql = 'SELECT id, name, email, password FROM users WHERE email = ?';

      const [result, _] = (await pool.query(sql, [email])) as [IUser[], any];

      console.log('findByEmail - res', result);
      return !!result.length ? result[0] : null;
    } catch (err) {
      console.warn('Error finding user by email:', err);
      return null;
    }
  }

  /* 

  static async getUserById(id: number, db: PoolClient) {
    try {
      const sql = 'SELECT * FROM users WHERE id = $1';
      const result: QueryResult<IUser> = await db.query(sql, [id]);
      return result.rows[0] || null;
    } catch (err) {
      console.warn('Error finding user by id:', err);
      return null;
    }
  } */
}

export { UserModel };
