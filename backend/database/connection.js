const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool for better performance with SSL support
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'moviestream_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully to:', process.env.DB_HOST);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database and tables
const initializeDatabase = async () => {
  try {
    // Test main connection (Aiven database already exists)
    await testConnection();

    // Create tables
    await createTables();
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

// Create all required tables
const createTables = async () => {
  try {
    // Admin table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Movies table
    await pool.execute(`
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
      )
    `);

    // Movie servers table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS movie_servers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        movie_id INT NOT NULL,
        server_name VARCHAR(100) NOT NULL,
        server_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
        INDEX idx_movie_id (movie_id)
      )
    `);

    // Ads table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ads (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        image_url TEXT,
        ad_code TEXT,
        redirect_link TEXT,
        position ENUM('top', 'sidebar', 'bottom') NOT NULL,
        enabled BOOLEAN DEFAULT TRUE,
        clicks INT DEFAULT 0,
        impressions INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_position (position),
        INDEX idx_enabled (enabled)
      )
    `);

    // Check if ad_code column exists, if not add it (for existing installations)
    try {
      await pool.execute(`ALTER TABLE ads ADD COLUMN ad_code TEXT AFTER image_url`);
      console.log('✅ Added ad_code column to ads table');
    } catch (error) {
      // Column already exists, ignore error
      if (!error.message.includes('Duplicate column name')) {
        console.log('ℹ️ ad_code column already exists');
      }
    }

    // Modify image_url to allow NULL values
    try {
      await pool.execute(`ALTER TABLE ads MODIFY COLUMN image_url TEXT NULL`);
      console.log('✅ Modified image_url column to allow NULL');
    } catch (error) {
      console.log('ℹ️ image_url column modification skipped:', error.message);
    }

    // Modify redirect_link to allow NULL values
    try {
      await pool.execute(`ALTER TABLE ads MODIFY COLUMN redirect_link TEXT NULL`);
      console.log('✅ Modified redirect_link column to allow NULL');
    } catch (error) {
      console.log('ℹ️ redirect_link column modification skipped:', error.message);
    }

    // Popup settings table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS popup_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        enabled BOOLEAN DEFAULT TRUE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        discord_link TEXT,
        facebook_link TEXT,
        twitter_link TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Site settings table
    await pool.execute(`
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
      )
    `);

    console.log('✅ All tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  }
};

// Insert default data
const insertDefaultData = async () => {
  try {
    // Check if admin exists
    const [adminRows] = await pool.execute('SELECT COUNT(*) as count FROM admins');
    if (adminRows[0].count === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Nishan1010@@##$$__', 12);
      
      await pool.execute(
        'INSERT INTO admins (email, password) VALUES (?, ?)',
        [process.env.ADMIN_EMAIL || 'admin@nishanbajagain.com.np', hashedPassword]
      );
      console.log('✅ Default admin created:', process.env.ADMIN_EMAIL);
    } else {
      // Update existing admin with new credentials
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Nishan1010@@##$$__', 12);
      
      await pool.execute(
        'UPDATE admins SET email = ?, password = ? WHERE id = 1',
        [process.env.ADMIN_EMAIL || 'admin@nishanbajagain.com.np', hashedPassword]
      );
      console.log('✅ Admin credentials updated:', process.env.ADMIN_EMAIL);
    }

    // Check if popup settings exist
    const [popupRows] = await pool.execute('SELECT COUNT(*) as count FROM popup_settings');
    if (popupRows[0].count === 0) {
      await pool.execute(`
        INSERT INTO popup_settings (title, description, discord_link, facebook_link, twitter_link) 
        VALUES (?, ?, ?, ?, ?)
      `, [
        'Welcome to MovieStream!',
        'Join our community and stay updated with the latest movies and releases. Follow us on social media for exclusive content and updates.',
        'https://discord.gg/moviestream',
        'https://facebook.com/moviestream',
        'https://twitter.com/moviestream'
      ]);
      console.log('✅ Default popup settings created');
    }

    // Check if site settings exist
    const [siteRows] = await pool.execute('SELECT COUNT(*) as count FROM site_settings');
    if (siteRows[0].count === 0) {
      await pool.execute(`
        INSERT INTO site_settings (site_name, site_description, footer_text, contact_email) 
        VALUES (?, ?, ?, ?)
      `, [
        'MovieStream',
        'Your ultimate destination for free movie streaming',
        '© 2024 MovieStream. All rights reserved. | Contact: admin@nishanbajaagin.com.np',
        'admin@nishanbajaagin.com.np'
      ]);
      console.log('✅ Default site settings created');
    }

    // Insert sample movies if none exist
    const [movieRows] = await pool.execute('SELECT COUNT(*) as count FROM movies');
    if (movieRows[0].count === 0) {
      const sampleMovies = [
        {
          name: 'The Dark Knight',
          poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
          release_date: '2008-07-18',
          rating: 9.0,
          genre: 'Action, Crime, Drama',
          playtime: '152 min',
          description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.'
        },
        {
          name: 'Inception',
          poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
          release_date: '2010-07-16',
          rating: 8.8,
          genre: 'Sci-Fi, Action, Thriller',
          playtime: '148 min',
          description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.'
        },
        {
          name: 'Interstellar',
          poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
          release_date: '2014-11-07',
          rating: 8.6,
          genre: 'Sci-Fi, Drama, Adventure',
          playtime: '169 min',
          description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.'
        },
        {
          name: 'The Matrix',
          poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
          release_date: '1999-03-31',
          rating: 8.7,
          genre: 'Action, Sci-Fi',
          playtime: '136 min',
          description: 'A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.'
        },
        {
          name: 'Pulp Fiction',
          poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
          release_date: '1994-10-14',
          rating: 8.9,
          genre: 'Crime, Drama',
          playtime: '154 min',
          description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.'
        },
        {
          name: 'The Godfather',
          poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
          release_date: '1972-03-24',
          rating: 9.2,
          genre: 'Crime, Drama',
          playtime: '175 min',
          description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.'
        }
      ];

      for (const movie of sampleMovies) {
        const [result] = await pool.execute(`
          INSERT INTO movies (name, poster, release_date, rating, genre, playtime, description, views) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          movie.name, movie.poster, movie.release_date, movie.rating, 
          movie.genre, movie.playtime, movie.description, Math.floor(Math.random() * 1000) + 100
        ]);

        // Add sample servers for each movie
        const movieId = result.insertId;
        const servers = [
          { name: 'UpCloud', url: 'https://www.youtube.com/embed/EXeTwQWrcwY' },
          { name: 'MegaCloud', url: 'https://www.youtube.com/embed/EXeTwQWrcwY' },
          { name: 'StreamSB', url: 'https://www.youtube.com/embed/EXeTwQWrcwY' }
        ];

        for (const server of servers) {
          await pool.execute(
            'INSERT INTO movie_servers (movie_id, server_name, server_url) VALUES (?, ?, ?)',
            [movieId, server.name, server.url]
          );
        }
      }
      console.log('✅ Sample movies created');
    }

    // Insert sample ads if none exist
    const [adRows] = await pool.execute('SELECT COUNT(*) as count FROM ads');
    if (adRows[0].count === 0) {
      const sampleAds = [
        {
          name: 'Adstera Top Banner',
          ad_code: `<script type="text/javascript">
            atOptions = {
              'key' : 'your-adstera-top-key-here',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
              'params' : {}
            };
            document.write('<scr' + 'ipt type="text/javascript" src="//www.topcreativeformat.com/your-adstera-top-key-here/invoke.js"></scr' + 'ipt>');
          </script>`,
          position: 'top'
        },
        {
          name: 'Adstera Sidebar',
          ad_code: `<script type="text/javascript">
            atOptions = {
              'key' : 'your-adstera-sidebar-key-here',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
            document.write('<scr' + 'ipt type="text/javascript" src="//www.topcreativeformat.com/your-adstera-sidebar-key-here/invoke.js"></scr' + 'ipt>');
          </script>`,
          position: 'sidebar'
        },
        {
          name: 'Adstera Bottom Banner',
          ad_code: `<script type="text/javascript">
            atOptions = {
              'key' : 'your-adstera-bottom-key-here',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
              'params' : {}
            };
            document.write('<scr' + 'ipt type="text/javascript" src="//www.topcreativeformat.com/your-adstera-bottom-key-here/invoke.js"></scr' + 'ipt>');
          </script>`,
          position: 'bottom'
        }
      ];

      for (const ad of sampleAds) {
        await pool.execute(`
          INSERT INTO ads (name, ad_code, position, enabled, image_url, redirect_link) 
          VALUES (?, ?, ?, ?, ?, ?)
        `, [ad.name, ad.ad_code, ad.position, true, null, null]);
      }
      console.log('✅ Sample Adstera ads created');
    }

    console.log('✅ Default data inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting default data:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
  insertDefaultData
};