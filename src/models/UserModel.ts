import { IUser, UserStatus } from '../interfaces/user';
import { logWithSeparator } from '../utils/log';
import pool from '../DB/db-connect';
import { Status } from '../interfaces/general';
import { ResultSetHeader } from 'mysql2';

class UserModel {
  static async get() {
    try {
      const sql = `
      SELECT * 
      FROM users
      `;

      const [result, _] = await pool.query<any[]>(sql);

      !!result.length &&
        logWithSeparator(
          `✅  All ${result.length} users were fetched`,
          'green'
        );

      return !!result.length ? result : null;
    } catch (err) {
      console.warn('Error fetching users:', err);
      return null;
    }
  }

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

      const [result, _] = await pool.query<ResultSetHeader>(sql, [
        safeUserName,
        email,
        safePassword,
        role,
        status,
        safeAllowedSiteIds,
      ]);

      const insertedId = result?.insertId;

      !!insertedId &&
        logWithSeparator(`✅  User with id ${insertedId} was added.`, 'green');

      return !!insertedId
        ? { status: Status.SUCCESS, id: insertedId, message: 'User added.' }
        : { status: Status.FAIL, id: null, message: 'User was not added.' };
    } catch (err: any) {
      // Detect duplicate email case
      if (err.code === 'ER_DUP_ENTRY') {
        return {
          status: Status.FAIL,
          message: `A user with email ${email} already exists.`,
          id: null,
        };
      }

      console.warn('Error adding user to DB:', err);
      return {
        status: Status.FAIL,
        message: `Error adding user to DB`,
        id: null,
      };
    }
  }

  static async findByEmail(email: string) {
    try {
      const sql = 'SELECT * FROM users WHERE email = ?';

      const [result, _] = (await pool.query(sql, [email])) as any;

      return !!result.length ? result[0] : null;
    } catch (err) {
      console.warn('Error finding user by email:', err);
      return null;
    }
  }

  static async getUserById(id: number) {
    try {
      const sql = 'SELECT * FROM users WHERE id = ?';
      const [result, _] = (await pool.query(sql, [id])) as any;
      return result[0] || null;
    } catch (err) {
      console.warn('Error finding user by id:', err);
      return null;
    }
  }

  static async edit(
    id: number,
    name: string,
    password: string,
    status: UserStatus
  ) {
    try {
      const sql = `UPDATE users SET 
      name = ?, 
      password = ?,
      status = ?
      WHERE id = ?
      `;

      const [result, _] = (await pool.query(sql, [
        name,
        password,
        status,
        id,
      ])) as [ResultSetHeader, any];

      !!result.affectedRows &&
        logWithSeparator(`✅ User ${name} was updated in database`, 'green');

      return !!result.affectedRows ? true : null;
    } catch (err) {
      console.warn('Error updating site in DB:', err);
      return null;
    }
  }
}

export { UserModel };
