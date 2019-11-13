-- Drops posts table
DROP TABLE IF EXISTS posts;

-- Creates posts table
CREATE TABLE IF NOT EXISTS posts (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , author varchar(64) NOT NULL
    , title varchar(64) NOT NULL
    , content text NOT NULL
);