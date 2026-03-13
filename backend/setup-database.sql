-- MovieStream Database Setup Script
-- Run this if you want to manually create the database

-- Create database
CREATE DATABASE IF NOT EXISTS moviestream_db;
USE moviestream_db;

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  poster TEXT,
  release_date DATE,
  rating DECIMAL(3,1),
  genre VARCHAR(255),
  playtime VARCHAR(50),
  tmdb_id VARCHAR(50),
  description TEXT,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_genre (genre),
  INDEX idx_rating (rating),
  INDEX idx_release_date (release_date)
);

-- Create movie_servers table
CREATE TABLE IF NOT EXISTS movie_servers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  movie_id INT NOT NULL,
  server_name VARCHAR(100) NOT NULL,
  server_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  INDEX idx_movie_id (movie_id)
);

-- Create ads table
CREATE TABLE IF NOT EXISTS ads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  redirect_link TEXT NOT NULL,
  position ENUM('top', 'sidebar', 'bottom') NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  clicks INT DEFAULT 0,
  impressions INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_position (position),
  INDEX idx_enabled (enabled)
);

-- Create popup_settings table
CREATE TABLE IF NOT EXISTS popup_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  enabled BOOLEAN DEFAULT TRUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discord_link TEXT,
  facebook_link TEXT,
  twitter_link TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  site_name VARCHAR(255) DEFAULT 'MovieStream',
  site_description TEXT,
  site_logo TEXT,
  favicon TEXT,
  primary_color VARCHAR(7) DEFAULT '#e50914',
  footer_text TEXT,
  contact_email VARCHAR(255),
  maintenance_mode BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin (password: Nishan1010@@!!)
INSERT IGNORE INTO admins (email, password) VALUES 
('admin@nishanbajaagin.com.np', '$2b$12$8K8VQJ5kF7mGxJ5kF7mGxOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G');

-- Insert default popup settings
INSERT IGNORE INTO popup_settings (title, description, discord_link, facebook_link, twitter_link) VALUES 
('Welcome to MovieStream!', 'Join our community and stay updated with the latest movies and releases. Follow us on social media for exclusive content and updates.', 'https://discord.gg/moviestream', 'https://facebook.com/moviestream', 'https://twitter.com/moviestream');

-- Insert default site settings
INSERT IGNORE INTO site_settings (site_name, site_description, footer_text, contact_email) VALUES 
('MovieStream', 'Your ultimate destination for free movie streaming', '© 2024 MovieStream. All rights reserved. | Contact: admin@nishanbajaagin.com.np', 'admin@nishanbajaagin.com.np');

-- Insert sample movies
INSERT IGNORE INTO movies (id, name, poster, release_date, rating, genre, playtime, description, views) VALUES 
(1, 'The Dark Knight', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', '2008-07-18', 9.0, 'Action, Crime, Drama', '152 min', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 1250),
(2, 'Inception', 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', '2010-07-16', 8.8, 'Sci-Fi, Action, Thriller', '148 min', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 980),
(3, 'Interstellar', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', '2014-11-07', 8.6, 'Sci-Fi, Drama, Adventure', '169 min', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', 750),
(4, 'The Matrix', 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', '1999-03-31', 8.7, 'Action, Sci-Fi', '136 min', 'A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.', 890),
(5, 'Pulp Fiction', 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', '1994-10-14', 8.9, 'Crime, Drama', '154 min', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 1100),
(6, 'The Godfather', 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', '1972-03-24', 9.2, 'Crime, Drama', '175 min', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 1500);

-- Insert sample movie servers
INSERT IGNORE INTO movie_servers (movie_id, server_name, server_url) VALUES 
(1, 'UpCloud', 'https://www.youtube.com/embed/EXeTwQWrcwY'),
(1, 'MegaCloud', 'https://www.youtube.com/embed/EXeTwQWrcwY'),
(1, 'StreamSB', 'https://www.youtube.com/embed/EXeTwQWrcwY'),
(2, 'UpCloud', 'https://www.youtube.com/embed/YoHD9XEInc0'),
(2, 'MegaCloud', 'https://www.youtube.com/embed/YoHD9XEInc0'),
(2, 'StreamSB', 'https://www.youtube.com/embed/YoHD9XEInc0'),
(3, 'UpCloud', 'https://www.youtube.com/embed/zSWdZVtXT7E'),
(3, 'MegaCloud', 'https://www.youtube.com/embed/zSWdZVtXT7E'),
(3, 'StreamSB', 'https://www.youtube.com/embed/zSWdZVtXT7E'),
(4, 'UpCloud', 'https://www.youtube.com/embed/vKQi3bBA1y8'),
(4, 'MegaCloud', 'https://www.youtube.com/embed/vKQi3bBA1y8'),
(4, 'StreamSB', 'https://www.youtube.com/embed/vKQi3bBA1y8'),
(5, 'UpCloud', 'https://www.youtube.com/embed/s7EdQ4FqbhY'),
(5, 'MegaCloud', 'https://www.youtube.com/embed/s7EdQ4FqbhY'),
(5, 'StreamSB', 'https://www.youtube.com/embed/s7EdQ4FqbhY'),
(6, 'UpCloud', 'https://www.youtube.com/embed/sY1S34973zA'),
(6, 'MegaCloud', 'https://www.youtube.com/embed/sY1S34973zA'),
(6, 'StreamSB', 'https://www.youtube.com/embed/sY1S34973zA');

-- Insert sample ads
INSERT IGNORE INTO ads (name, image_url, redirect_link, position, enabled, clicks, impressions) VALUES 
('Top Banner Ad', 'https://via.placeholder.com/728x90/333/fff?text=Top+Banner+Advertisement', 'https://example.com', 'top', TRUE, 150, 2500),
('Sidebar Ad', 'https://via.placeholder.com/300x250/333/fff?text=Sidebar+Advertisement', 'https://example.com', 'sidebar', TRUE, 89, 1200),
('Bottom Banner Ad', 'https://via.placeholder.com/728x90/333/fff?text=Bottom+Banner+Advertisement', 'https://example.com', 'bottom', TRUE, 200, 3000);

SELECT 'Database setup completed successfully!' as message;