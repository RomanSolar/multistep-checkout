const argon2 = require('argon2');
const express = require('express');
const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL, { onnotice: () => {} });
sql`
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  password TEXT,
  line1 TEXT,
  line2 TEXT,
  city TEXT,
  state TEXT,
  zipcode INTEGER,
  phone BIGINT,
  ccNumber BIGINT,
  ccExpiry DATE,
  ccCVV SMALLINT,
  ccZipcode INTEGER
)
`.catch(console.log);

const app = express();
app.use(express.json());
app.use(express.static(__dirname + '/public/'));

app.post('/', async (req, res) => {
  console.log(req.body);
  const body = req.body;
  const id = body.id;
  delete body.id;
  if ('password' in body) {
    body.password = await argon2.hash(body.password);
  }
  query = id
    ? sql`UPDATE users SET ${sql(body)} where id = ${id}`.then(() => id)
    : sql`INSERT INTO users ${sql(body)} RETURNING id`.then(([result]) => result.id);
  try {
    const newId = await query;
    res.send(newId.toString());
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.listen(8080, () => {
  console.log('listening on port 8080');
});
