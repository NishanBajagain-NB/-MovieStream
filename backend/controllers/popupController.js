const { pool } = require('../database/connection');

// Get popup settings
const getPopupSettings = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM popup_settings ORDER BY id DESC LIMIT 1');
    
    if (rows.length === 0) {
      return res.json({
        success: true,
        data: {
          enabled: false,
          title: '',
          description: '',
          discord_link: '',
          facebook_link: '',
          twitter_link: ''
        }
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get popup settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update popup settings
const updatePopupSettings = async (req, res) => {
  try {
    const { enabled, title, description, discord_link, facebook_link, twitter_link } = req.body;
    
    // Check if settings exist
    const [existingRows] = await pool.execute('SELECT id FROM popup_settings LIMIT 1');
    
    if (existingRows.length === 0) {
      // Create new settings
      await pool.execute(`
        INSERT INTO popup_settings (enabled, title, description, discord_link, facebook_link, twitter_link)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [enabled, title, description, discord_link, facebook_link, twitter_link]);
    } else {
      // Update existing settings
      await pool.execute(`
        UPDATE popup_settings 
        SET enabled = ?, title = ?, description = ?, discord_link = ?, facebook_link = ?, twitter_link = ?
        WHERE id = ?
      `, [enabled, title, description, discord_link, facebook_link, twitter_link, existingRows[0].id]);
    }
    
    // Return updated settings
    const [updatedRows] = await pool.execute('SELECT * FROM popup_settings ORDER BY id DESC LIMIT 1');
    
    res.json({
      success: true,
      message: 'Popup settings updated successfully',
      data: updatedRows[0]
    });
  } catch (error) {
    console.error('Update popup settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getPopupSettings,
  updatePopupSettings
};