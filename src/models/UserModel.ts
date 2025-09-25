import { IUser } from '../interfaces/user';
import { logWithSeparator } from '../utils/log';
import pool from '../DB/db-connect';
import { Status } from '../interfaces/general';

class UserModel {
  static async add({
    name,
    email,
    password,
    role,
    allowedSiteIds,
    status,
  }: IUser) {
    try {
      const safeUserName = name || '';
      const safePassword = password || '';
      const safeAllowedSiteIds = JSON.stringify(allowedSiteIds);

      const sql = `INSERT INTO users(
        name, email, password, role, status, allowed_site_ids)
        VALUES (?, ?, ?, ?, ?, ?)
        `;

      const [result, _] = (await pool.query(sql, [
        safeUserName,
        email,
        safePassword,
        role,
        status,
        safeAllowedSiteIds,
      ])) as [IUser[], any];

      !!result.length &&
        logWithSeparator(
          `✅  User ${result[0].name} was added with id ${result[0].id}`,
          'green'
        );

      return !!result.length
        ? { status: Status.SUCCESS, id: result[0].id }
        : null;
    } catch (err: any) {
      // Detect duplicate email case
      if (err.code === 'ER_DUP_ENTRY') {
        return {
          status: Status.FAIL,
          message: `A user with email ${email} already exists.`,
        };
      }

      console.warn('Error adding user to DB:', err);
      return null;
    }
  }

  static async findByEmail(email: string) {
    try {
      const sql = 'SELECT * FROM users WHERE email = ?';

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
