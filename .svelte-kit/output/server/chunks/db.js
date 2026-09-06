import { neon } from "@neondatabase/serverless";
const DEFAULT_DATABASE_URL = "postgresql://neondb_owner:npg_cH3eDR5VhETs@ep-soft-wildflower-az092xod-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const clientCache = /* @__PURE__ */ new Map();
function getNeonClient(connectionString) {
  let client = clientCache.get(connectionString);
  if (!client) {
    client = neon(connectionString);
    clientCache.set(connectionString, client);
  }
  return client;
}
function transformQuery(sql) {
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let paramIndex = 1;
  let result = "";
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const prevChar = i > 0 ? sql[i - 1] : "";
    if (char === "'" && prevChar !== "\\") {
      inSingleQuote = !inSingleQuote;
      result += char;
    } else if (char === '"' && prevChar !== "\\") {
      inDoubleQuote = !inDoubleQuote;
      result += char;
    } else if (char === "?" && !inSingleQuote && !inDoubleQuote) {
      result += `$${paramIndex++}`;
    } else {
      result += char;
    }
  }
  result = result.replace(/datetime\s*\(\s*['"]now['"]\s*\)/gi, "to_char(NOW(), 'YYYY-MM-DD HH24:MI:SS')");
  result = result.replace(/"([^"]*)"/g, "'$1'");
  result = result.replace(
    /\bGROUP_CONCAT\s*\(\s*DISTINCT\s+([^,\)]+)\s*(?:,\s*('[^']*'|"[^"]*"))?\s*\)/gi,
    (_, col, sep) => `STRING_AGG(DISTINCT (${col})::text, ${sep ? sep.replace(/"/g, "'") : "', '"})`
  );
  result = result.replace(
    /\bGROUP_CONCAT\s*\(\s*([^,\)]+)\s*(?:,\s*('[^']*'|"[^"]*"))?\s*\)/gi,
    (_, col, sep) => `STRING_AGG((${col})::text, ${sep ? sep.replace(/"/g, "'") : "', '"})`
  );
  result = result.replace(/\bjson_group_array\s*\(/gi, "json_agg(");
  result = result.replace(/\bjson_object\s*\(/gi, "json_build_object(");
  result = result.replace(
    /\bSELECT\s+value\s+FROM\s+json_each\s*\(\s*([^)]+)\s*\)/gi,
    "SELECT json_array_elements_text(($1)::json)::int"
  );
  result = result.replace(
    /\bjulianday\s*\(\s*([^)]+)\s*\)/gi,
    "(EXTRACT(EPOCH FROM (NULLIF(($1)::text, '')::timestamp)) / 86400.0 + 2440587.5)"
  );
  if (/^\s*INSERT\s+OR\s+IGNORE\s+INTO/i.test(result)) {
    result = result.replace(/^\s*INSERT\s+OR\s+IGNORE\s+INTO/i, "INSERT INTO");
    if (!/ON\s+CONFLICT/i.test(result)) {
      result = result.replace(/;?\s*$/, " ON CONFLICT DO NOTHING");
    }
  }
  const trimmed = result.trim();
  const isInsert = /^\s*INSERT\s+INTO/i.test(trimmed);
  const hasReturning = /\bRETURNING\b/i.test(trimmed);
  let pgSqlWithReturning = result;
  if (isInsert && !hasReturning && !/ON\s+CONFLICT\s+DO\s+NOTHING/i.test(trimmed)) {
    pgSqlWithReturning = result.replace(/;?\s*$/, " RETURNING id");
  }
  return {
    pgSql: result,
    pgSqlWithReturning,
    isInsert,
    hasReturning
  };
}
function sanitizeRow(row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return row;
  const res = {};
  const stringOnlyColumns = [
    "password_hash",
    "token_code",
    "phone",
    "nisn",
    "nomor_peserta",
    "login_pin",
    "code",
    "session_token",
    "nip",
    "options_json",
    "correct_answer_json",
    "violation_logs",
    "signature",
    "answer_given",
    "start_time",
    "end_time",
    "created_at",
    "updated_at",
    "paused_at",
    "released_at",
    "expires_at",
    "answered_at",
    "last_active_at",
    "date_of_birth"
  ];
  for (const [key, val] of Object.entries(row)) {
    if (typeof val === "string" && /^-?\d+$/.test(val) && val.length < 16 && !stringOnlyColumns.includes(key.toLowerCase())) {
      const num = Number(val);
      if (Number.isSafeInteger(num)) {
        res[key] = num;
        continue;
      }
    }
    res[key] = val;
  }
  return res;
}
function createNeonD1Adapter(connectionString) {
  const sql = getNeonClient(connectionString);
  const executeQuery = async (queryText, params = [], withFullResult = false) => {
    const cleanParams = params.map((p) => p === void 0 ? null : p);
    try {
      if (sql.query) {
        return await sql.query(queryText, cleanParams, { fullResults: withFullResult });
      }
      return await sql(queryText, cleanParams);
    } catch (err) {
      console.error("Neon DB Error:", err, "\nQuery:", queryText, "\nParams:", cleanParams);
      throw err;
    }
  };
  function createPreparedStatement(query, boundParams = []) {
    const stmtObj = {
      bind(...values) {
        const flatValues = values.length === 1 && Array.isArray(values[0]) ? values[0] : values;
        return createPreparedStatement(query, flatValues);
      },
      async all() {
        const { pgSql } = transformQuery(query);
        const rawRows = await executeQuery(pgSql, boundParams);
        const rows = Array.isArray(rawRows) ? rawRows.map((r) => sanitizeRow(r)) : [];
        return {
          results: rows || [],
          success: true,
          meta: {
            changes: 0,
            last_row_id: null,
            duration: 0,
            rows_read: rows?.length || 0,
            rows_written: 0
          }
        };
      },
      async first(colName) {
        const { pgSql } = transformQuery(query);
        const rawRows = await executeQuery(pgSql, boundParams);
        if (!rawRows || rawRows.length === 0) return null;
        const firstRow = sanitizeRow(rawRows[0]);
        if (colName) {
          return firstRow[colName] ?? null;
        }
        return firstRow;
      },
      async run() {
        const { pgSql, pgSqlWithReturning, isInsert, hasReturning } = transformQuery(query);
        const queryToRun = isInsert && !hasReturning ? pgSqlWithReturning : pgSql;
        const res = await executeQuery(queryToRun, boundParams, true);
        let lastRowId = null;
        let rowCount = 0;
        if (Array.isArray(res)) {
          if (isInsert && res.length > 0 && res[0]?.id !== void 0) {
            lastRowId = Number(res[0].id);
          }
          rowCount = res.length;
        } else if (res && typeof res === "object") {
          if (res.rows && Array.isArray(res.rows)) {
            if (isInsert && res.rows.length > 0 && res.rows[0]?.id !== void 0) {
              lastRowId = Number(res.rows[0].id);
            }
            rowCount = res.rowCount ?? res.rows.length;
          } else {
            rowCount = res.rowCount ?? 0;
          }
        }
        return {
          success: true,
          meta: {
            changes: rowCount,
            last_row_id: lastRowId,
            duration: 0,
            rows_read: 0,
            rows_written: rowCount
          },
          results: []
        };
      },
      async raw(options) {
        const { pgSql } = transformQuery(query);
        const rows = await executeQuery(pgSql, boundParams);
        if (!rows || rows.length === 0) return [];
        const values = rows.map((r) => Object.values(r));
        if (options?.columnNames && rows[0]) {
          return [Object.keys(rows[0]), ...values];
        }
        return values;
      }
    };
    return stmtObj;
  }
  const adapter = {
    prepare(query) {
      return createPreparedStatement(query);
    },
    async batch(statements) {
      const results = [];
      for (const stmt of statements) {
        const res = await stmt.run();
        results.push(res);
      }
      return results;
    },
    async exec(query) {
      const statements = query.split(";").map((s) => s.trim()).filter(Boolean);
      for (const stmt of statements) {
        await executeQuery(stmt);
      }
      return {
        count: statements.length,
        duration: 0
      };
    },
    withSession(_token) {
      return adapter;
    },
    dump() {
      throw new Error("dump() is not supported on Neon PostgreSQL adapter.");
    }
  };
  return adapter;
}
function getDB(platform) {
  const dbUrl = platform?.env?.DATABASE_URL || (typeof process !== "undefined" ? process.env?.DATABASE_URL : void 0) || DEFAULT_DATABASE_URL;
  {
    return createNeonD1Adapter(dbUrl);
  }
}
async function dbRun(db, query, ...params) {
  try {
    return await db.prepare(query).bind(...params).run();
  } catch (err) {
    console.error("DB Error:", err);
    throw err;
  }
}
async function ensureUserLoginPinColumn(db) {
  return;
}
export {
  dbRun as d,
  ensureUserLoginPinColumn as e,
  getDB as g
};
