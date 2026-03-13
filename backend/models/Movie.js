const { pool } = require('../database/connection');

class Movie {
  // Get all movies with pagination and search
  static async getAll(page = 1, limit = 20, search = '') {
    try {
      const offset = (page - 1) * limit;
      let query = `SELECT * FROM movies`;
      
      const params = [];
      
      if (search && search.trim()) {
        query += ` WHERE name LIKE ? OR genre LIKE ? OR description LIKE ?`;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }
      
      query += ` ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
      
      const [rows] = await pool.execute(query, params);
      
      // Get servers for each movie
      const movies = [];
      for (const movie of rows) {
        const [serverRows] = await pool.execute(
          'SELECT server_name, server_url FROM movie_servers WHERE movie_id = ?',
          [movie.id]
        );
        movies.push({
          ...movie,
          servers: serverRows
        });
      }
      
      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) as total FROM movies';
      const countParams = [];
      
      if (search && search.trim()) {
        countQuery += ' WHERE name LIKE ? OR genre LIKE ? OR description LIKE ?';
        const searchTerm = `%${search}%`;
        countParams.push(searchTerm, searchTerm, searchTerm);
      }
      
      const [countRows] = await pool.execute(countQuery, countParams);
      const total = countRows[0].total;
      
      return {
        movies,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error fetching movies: ${error.message}`);
    }
  }

  // Get movie by ID
  static async getById(id) {
    try {
      const [movieRows] = await pool.execute(
        'SELECT * FROM movies WHERE id = ?',
        [id]
      );
      
      if (movieRows.length === 0) {
        return null;
      }
      
      const movie = movieRows[0];
      
      // Get servers for this movie
      const [serverRows] = await pool.execute(
        'SELECT server_name, server_url FROM movie_servers WHERE movie_id = ?',
        [id]
      );
      
      movie.servers = serverRows;
      
      // Increment view count
      await pool.execute(
        'UPDATE movies SET views = views + 1 WHERE id = ?',
        [id]
      );
      
      return movie;
    } catch (error) {
      throw new Error(`Error fetching movie: ${error.message}`);
    }
  }

  // Get newly added movies
  static async getNewlyAdded(limit = 10) {
    try {
      const [rows] = await pool.execute(`
        SELECT * FROM movies
        ORDER BY created_at DESC
        LIMIT ${parseInt(limit)}
      `);
      
      // Get servers for each movie
      const movies = [];
      for (const movie of rows) {
        const [serverRows] = await pool.execute(
          'SELECT server_name, server_url FROM movie_servers WHERE movie_id = ?',
          [movie.id]
        );
        movies.push({
          ...movie,
          servers: serverRows
        });
      }
      
      return movies;
    } catch (error) {
      throw new Error(`Error fetching newly added movies: ${error.message}`);
    }
  }

  // Create new movie
  static async create(movieData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const { servers, ...movieInfo } = movieData;
      
      // Insert movie
      const [result] = await connection.execute(`
        INSERT INTO movies (name, poster, release_date, rating, genre, playtime, tmdb_id, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        movieInfo.name,
        movieInfo.poster || null,
        movieInfo.release_date || null,
        movieInfo.rating || null,
        movieInfo.genre || null,
        movieInfo.playtime || null,
        movieInfo.tmdb_id || null,
        movieInfo.description || null
      ]);
      
      const movieId = result.insertId;
      
      // Insert servers if provided
      if (servers && Array.isArray(servers)) {
        for (const server of servers) {
          await connection.execute(
            'INSERT INTO movie_servers (movie_id, server_name, server_url) VALUES (?, ?, ?)',
            [movieId, server.server_name, server.server_url]
          );
        }
      }
      
      await connection.commit();
      
      return await this.getById(movieId);
    } catch (error) {
      await connection.rollback();
      throw new Error(`Error creating movie: ${error.message}`);
    } finally {
      connection.release();
    }
  }

  // Update movie
  static async update(id, movieData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const { servers, ...movieInfo } = movieData;
      
      // Update movie
      await connection.execute(`
        UPDATE movies 
        SET name = ?, poster = ?, release_date = ?, rating = ?, 
            genre = ?, playtime = ?, tmdb_id = ?, description = ?
        WHERE id = ?
      `, [
        movieInfo.name,
        movieInfo.poster || null,
        movieInfo.release_date || null,
        movieInfo.rating || null,
        movieInfo.genre || null,
        movieInfo.playtime || null,
        movieInfo.tmdb_id || null,
        movieInfo.description || null,
        id
      ]);
      
      // Update servers if provided
      if (servers && Array.isArray(servers)) {
        // Delete existing servers
        await connection.execute('DELETE FROM movie_servers WHERE movie_id = ?', [id]);
        
        // Insert new servers
        for (const server of servers) {
          await connection.execute(
            'INSERT INTO movie_servers (movie_id, server_name, server_url) VALUES (?, ?, ?)',
            [id, server.server_name, server.server_url]
          );
        }
      }
      
      await connection.commit();
      
      return await this.getById(id);
    } catch (error) {
      await connection.rollback();
      throw new Error(`Error updating movie: ${error.message}`);
    } finally {
      connection.release();
    }
  }

  // Delete movie
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM movies WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting movie: ${error.message}`);
    }
  }

  // Get movie statistics
  static async getStats() {
    try {
      const [totalRows] = await pool.execute('SELECT COUNT(*) as total FROM movies');
      const [viewsRows] = await pool.execute('SELECT SUM(views) as total_views FROM movies');
      const [recentRows] = await pool.execute(`
        SELECT id, name, views, created_at 
        FROM movies 
        ORDER BY created_at DESC 
        LIMIT 5
      `);
      
      return {
        total_movies: totalRows[0].total,
        total_views: viewsRows[0].total_views || 0,
        recent_movies: recentRows
      };
    } catch (error) {
      throw new Error(`Error fetching movie stats: ${error.message}`);
    }
  }
}

module.exports = Movie;