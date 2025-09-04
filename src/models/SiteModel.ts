import { ResultSetHeader } from 'mysql2';

import { logWithSeparator } from '../utils/log';
import pool from '../DB/db-connect';
import { formatDateForMySQL } from '../utils/helpers';

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

      const formatedHostingValidUntil = formatDateForMySQL(hostingValiduntil);
      const formatedDomainValidUntil = formatDateForMySQL(domainValiduntil);
      const values: any[] = [
        user_id,
        name,
        hostingProvider,
        hostingLogin,
        hostingPassword,
        formatedHostingValidUntil,
        domainRegistrar,
        domainLogin,
        domainPassword,
        formatedDomainValidUntil,
        comments,
        status,
        email,
      ];

      const sql = `INSERT INTO sites(
        creator_id, name, hosting_provider, hosting_login, hosting_password, hosting_valid_until, domain_registrar, domain_login, domain_password, domain_valid_until, comments, status, last_modified_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

      const [result, _] = (await pool.query(sql, values)) as [
        ResultSetHeader,
        any
      ];

      !!result.affectedRows &&
        logWithSeparator(
          `✅ Site ${name} with id ${result.insertId} was added to database`,
          'green'
        );

      return !!result.affectedRows ? result.insertId : null;
    } catch (err) {
      console.warn('Error adding site to DB:', err);
      return null;
    }
  }
}

export { SiteModel };
