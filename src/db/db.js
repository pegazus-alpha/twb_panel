/*
 * @Author: pegazus-alpha pourdebutantp@gmail.com
 * @Date: 2025-07-13 08:07:08
 * @LastEditors: pegazus-alpha pourdebutantp@gmail.com
 * @LastEditTime: 2025-07-13 08:09:20
 * @FilePath: \panel\frontend\src\components\db\db.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import initSqlJs from 'sql.js';

let dbInstance = null;

export async function getDatabase() {
    if (dbInstance) return dbInstance;
    const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
    dbInstance = new SQL.Database();

    dbInstance.run(`
    CREATE TABLE IF NOT EXISTS utilisateurs (
      user_id INTEGER PRIMARY KEY,
      parrain_id INTEGER,
      nom TEXT,
      langue TEXT,
      montant_depot FLOAT,
      benefice_total FLOAT DEFAULT 0,
      commissions_totales INTEGER DEFAULT 0,
      date_enregistrement TEXT,
      adresse_wallet TEXT,
      date_mise_a_jour TEXT,
      cycle INTEGER DEFAULT 0,
      statut TEXT
    );

    CREATE TABLE IF NOT EXISTS retraits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      username TEXT,
      adresse TEXT,
      reseau TEXT,
      montant FLOAT,
      date_retrait TEXT
    );

    CREATE TABLE IF NOT EXISTS depot (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      username TEXT,
      adresse TEXT,
      montant FLOAT,
      date_depot TEXT
    );

    CREATE TABLE IF NOT EXISTS commissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      filleul_id INTEGER,
      niveau INTEGER,
      montant REAL,
      pourcentage REAL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

    return dbInstance;
}
