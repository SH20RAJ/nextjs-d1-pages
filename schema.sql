-- Drop tables if they exist
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS posts;

-- Create users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample data
INSERT INTO users (name, email) VALUES 
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com'),
  ('Bob Johnson', 'bob@example.com');

INSERT INTO posts (user_id, title, content) VALUES
  (1, 'First Post', 'This is my first post content'),
  (1, 'Second Post', 'This is another post by John'),
  (2, 'Hello World', 'Jane''s first blog post'),
  (3, 'Introduction', 'Hi, I''m Bob and this is my blog');
