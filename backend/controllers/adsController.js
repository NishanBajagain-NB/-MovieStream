const { pool } = require('../database/connection');

// Get all ads
const getAllAds = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM ads 
      ORDER BY created_at DESC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get all ads error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get ads by position
const getAdsByPosition = async (req, res) => {
  try {
    const { position } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT * FROM ads 
      WHERE position = ? AND enabled = true
      ORDER BY created_at DESC
    `, [position]);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get ads by position error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new ad
const createAd = async (req, res) => {
  try {
    const { name, image_url, ad_code, redirect_link, position, enabled = true } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO ads (name, image_url, ad_code, redirect_link, position, enabled)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, image_url || null, ad_code || null, redirect_link || null, position, enabled]);
    
    const [newAd] = await pool.execute('SELECT * FROM ads WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      data: newAd[0]
    });
  } catch (error) {
    console.error('Create ad error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update ad
const updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image_url, ad_code, redirect_link, position, enabled } = req.body;
    
    const [result] = await pool.execute(`
      UPDATE ads 
      SET name = ?, image_url = ?, ad_code = ?, redirect_link = ?, position = ?, enabled = ?
      WHERE id = ?
    `, [name, image_url || null, ad_code || null, redirect_link || null, position, enabled, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }
    
    const [updatedAd] = await pool.execute('SELECT * FROM ads WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Ad updated successfully',
      data: updatedAd[0]
    });
  } catch (error) {
    console.error('Update ad error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete ad
const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM ads WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Ad deleted successfully'
    });
  } catch (error) {
    console.error('Delete ad error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Track ad click
const trackClick = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.execute('UPDATE ads SET clicks = clicks + 1 WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Click tracked successfully'
    });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Track ad impression
const trackImpression = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.execute('UPDATE ads SET impressions = impressions + 1 WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Impression tracked successfully'
    });
  } catch (error) {
    console.error('Track impression error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllAds,
  getAdsByPosition,
  createAd,
  updateAd,
  deleteAd,
  trackClick,
  trackImpression
};