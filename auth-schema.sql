-- Drop tables if they exist
DROP TABLE IF EXISTS user_session;
DROP TABLE IF EXISTS user_key;
DROP TABLE IF EXISTS auth_user;

-- Create auth_user table
CREATE TABLE auth_user (
  id VARCHAR(15) NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE
);

-- Create user_key table
CREATE TABLE user_key (
  id VARCHAR(255) NOT NULL PRIMARY KEY,
  user_id VARCHAR(15) NOT NULL,
  hashed_password VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES auth_user(id)
);

-- Create user_session table
CREATE TABLE user_session (
  id VARCHAR(127) NOT NULL PRIMARY KEY,
  user_id VARCHAR(15) NOT NULL,
  active_expires BIGINT NOT NULL,
  idle_expires BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES auth_user(id)
);
