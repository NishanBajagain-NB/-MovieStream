const { pool } = require('../database/connection');

// Get site settings
const getSiteSettings = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM site_settings ORDER BY id DESC LIMIT 1');
    
    if (rows.length === 0) {
      return res.json({
        success: true,
        data: {
          site_name: 'MovieStream',
          site_description: 'Your ultimate destination for free movie streaming',
          site_logo: '',
          favicon: '',
          primary_color: '#e50914',
          footer_text: '© 2024 MovieStream. All rights reserved.',
          contact_email: 'contact@moviestream.com',
          maintenance_mode: false
        }
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get site settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update site settings
const updateSiteSettings = async (req, res) => {
  try {
    const {
      site_name,
      site_description,
      site_logo,
      favicon,
      primary_color,
      footer_text,
      contact_email,
      maintenance_mode
    } = req.body;
    
    // Check if settings exist
    const [existingRows] = await pool.execute('SELECT id FROM site_settings LIMIT 1');
    
    if (existingRows.length === 0) {
      // Create new settings
      await pool.execute(`
        INSERT INTO site_settings (
          site_name, site_description, site_logo, favicon, primary_color,
          footer_text, contact_email, maintenance_mode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        site_name, site_description, site_logo, favicon, primary_color,
        footer_text, contact_email, maintenance_mode
      ]);
    } else {
      // Update existing settings
      await pool.execute(`
        UPDATE site_settings 
        SET site_name = ?, site_description = ?, site_logo = ?, favicon = ?,
            primary_color = ?, footer_text = ?, contact_email = ?, maintenance_mode = ?
        WHERE id = ?
      `, [
        site_name, site_description, site_logo, favicon, primary_color,
        footer_text, contact_email, maintenance_mode, existingRows[0].id
      ]);
    }
    
    // Return updated settings
    const [updatedRows] = await pool.execute('SELECT * FROM site_settings ORDER BY id DESC LIMIT 1');
    
    res.json({
      success: true,
      message: 'Site settings updated successfully',
      data: updatedRows[0]
    });
  } catch (error) {
    console.error('Update site settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getSiteSettings,
  updateSiteSettings
};