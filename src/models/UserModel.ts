import { IUser } from '../interfaces/user';
import { logWithSeparator } from '../utils/log';
import pool from '../DB/db-connect';

class UserModel {
  static async add({ name, email, password, role }: IUser) {
    try {
      const safeUserName = name || '';
      const safePassword = password || '';

      const sql = `INSERT INTO users(
        name, email, password, role)
        VALUES (?, ?, ?, ?)
        `;

      const [result, _] = (await pool.query(sql, [
        safeUserName,
        email,
        safePassword,
        role,
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
      const sql =
        'SELECT id, name, email, password, is_disabled, role FROM users WHERE email = ?';

      const [result, _] = (await pool.query(sql, [email])) as [IUser[], any];

      return !!result.length ? result[0] : null;
    } catch (err) {
      console.warn('Error finding user by email:', err);
      return null;
    }
  }

  static async getUserById(id: number) {
    try {
      const sql = 'SELECT * FROM users WHERE id = ?';
      const [result, _] = (await pool.query(sql, [id])) as [IUser[], any];
      return result[0] || null;
    } catch (err) {
      console.warn('Error finding user by id:', err);
      return null;
    }
  }
}

export { UserModel };
