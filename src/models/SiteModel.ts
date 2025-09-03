import { IUser } from '../interfaces/user';
import { logWithSeparator } from '../utils/log';
import pool from '../DB/db-connect';
import { ISite } from '../interfaces/site';

class SiteModel {
  static async add(data: any) {
    try {
      const {
        name,
        hostingProvider,
        hostingLogin,
        hostingPassword,
        hostingValiduntil,
        domainRegistrar,
        domainLogin,
        domainPassword,
        domainValiduntil,
        comments,
        status,
        user_id,
        email,
      } = data;
      const values: any[] = [
        user_id,
        name,
        hostingProvider,
        hostingLogin,
        hostingPassword,
        hostingValiduntil,
        domainRegistrar,
        domainLogin,
        domainPassword,
        domainValiduntil,
        comments,
        status,
        email,
      ];

      const sql = `INSERT INTO sites(
        creator_id, name, hosting_provider, hosting_login, hosting_password, hosting_valid_until,
        domain_registrar, domain_login, domain_password, domain_valid_until,
        comments, status, last_modified_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

      const [result, _] = (await pool.query(sql, values)) as [ISite[], any];

      // TODO: test adding site
      console.log('add - result', result);

      /* !!result.length &&
        logWithSeparator(
          `✅  User ${result[0].name} was added with id ${result[0].id}`,
          'green'
        ); */

      return !!result.length ? result[0] : null;
    } catch (err) {
      console.warn('Error adding user to DB:', err);
      return null;
    }
  }

  /* static async findByEmail(email: string) {
    try {
      const sql =
        'SELECT id, name, email, password, is_disabled FROM users WHERE email = ?';

      const [result, _] = (await pool.query(sql, [email])) as [IUser[], any];

      return !!result.length ? result[0] : null;
    } catch (err) {
      console.warn('Error finding user by email:', err);
      return null;
    }
  }

  static async getUserById(id: number) {
    try {
      const sql = 'SELECT * FROM users WHERE id = $1';
      const [result, _] = (await pool.query(sql, [id])) as [IUser[], any];
      return result[0] || null;
    } catch (err) {
      console.warn('Error finding user by id:', err);
      return null;
    }
  } */
}

export { SiteModel };
