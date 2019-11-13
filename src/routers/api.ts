import * as express from "express";
import pgPromise from "pg-promise";

export const register = (app: express.Application) => {
  const port = parseInt(process.env.PGPORT || "5432", 10);
  const config = {
    database: process.env.PGDATABASE || "postgres",
    host: process.env.PGHOST || "localhost",
    port,
    user: process.env.PGUSER || "postgres"
  };

  const pgp = pgPromise();
  const db = pgp(config);

  app.get(`/api/posts/all`, async (req, res) => {
    try {
      const posts = await db.any(`
            SELECT
                id
                , author
                , title
                , content
            FROM    posts
            ORDER BY id`);
      return res.json(posts);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({ error: err.message || err });
    }
  });

  app.get(`/api/posts/count`, async (req, res) => {
    try {
      const total = await db.one(`
        SELECT  count(1) AS total
        FROM    posts`, {}, (data: { total: number }) => {
        return {
          total: data.total
        };
      });
      return res.json(total);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({ error: err.message || err });
    }
  });

  app.post(`/api/posts/add`, async (req, res) => {
    try {
      const id = await db.one(`
            INSERT INTO posts( author, title, content )
            VALUES( $[author], $[title], $[content])
            RETURNING id;`,
        { ...req.body });
      return res.json({ id });
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({ error: err.message || err });
    }
  });

  app.post(`/api/posts/update`, async (req, res) => {
    try {
      const id = await db.one(`
            UPDATE posts
            SET title = $[title]
                , content = $[content]
                , author = $[author]
            WHERE
                id = $[id]
            RETURNING
                id;`,
        { ...req.body });
      return res.json({ id });
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({ error: err.message || err });
    }
  });

  app.delete(`/api/posts/remove/:id`,  async (req, res) => {
    try {
      const id = await db.result(`
          DELETE
          FROM    posts
          WHERE   id = $[id]`,
        { id: req.params.id }, (r) => r.rowCount);
      return res.json({ id });
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({ error: err.message || err });
    }
  });
};
