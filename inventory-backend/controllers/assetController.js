const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const AssetModel = require('../models/Asset');
const Asset = AssetModel(sequelize, Sequelize.DataTypes);
//const { Asset } = require("../models");
const RelocationModel = require('../models/Relocation');
const Relocation = RelocationModel(sequelize, Sequelize.DataTypes);

exports.createAsset = async (req, res) => {
  try {
    const { itemName, model, serialNumber, username, price, vendor, buyDate, invoice_no, registered_on, extraDetails } = req.body;

    const filePath = req.file ? req.file.filename : null;

    if (!itemName || !model || !serialNumber || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const uniqueId = `AST-${randomPart}`;

    const asset = await Asset.create({
      assetId: uniqueId,
      itemName,
      model,
      serialNumber,
      username,
      price: price || null,
      vendor,
      invoice_no,
      registered_on: registered_on || null,
      buyDate: buyDate || null,
      extraDetails: extraDetails || null,
      file: filePath
    });

    res.status(201).json({ message: "✅ Item saved successfully", asset });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create asset", details: err.message });
  }
};

// Get all assets
exports.getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll(); // no ordering on missing column
    res.json(assets);
  } catch (error) {
    console.error('❌ Error in getAllAssets:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
};


// Get single asset
exports.getAssetById = async (req, res) => {
  try {
    const id = req.params.id;
    const asset = await Asset.findByPk(id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    return res.json(asset);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch asset' });
  }
};

// Update asset (edit details)

exports.updateAsset = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      itemName,
      model,
      serialNumber,
      username,
      price,
      vendor,
      invoice_no,
      buyDate,
      registered_on,
      extraDetails
    } = req.body;

    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    await asset.update({
      itemName,
      model,
      serialNumber,
      username,
      price,
      vendor,
      invoice_no,
      buyDate,
      registered_on,
      extraDetails
    });

    return res.json({
      message: 'Asset updated successfully',
      asset
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update asset' });
  }
};

exports.relocateAsset = async (req, res) => {
  try {
    const assetId = req.params.id;
    const { fromLocation, toLocation, relocatedBy,assignedTo, reason } = req.body;

    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // Always CREATE new relocation record
    const relocation = await Relocation.create({
      assetId: asset.id,
      fromLocation,
      toLocation,
      relocatedBy,
      assignedTo,
      reason,
      relocatedAt: new Date()
    });

    return res.status(201).json({
      message: "✅ Asset relocated successfully",
      relocation
    });

  } catch (error) {
    console.error("Relocation error:", error);
    return res.status(500).json({ error: "Failed to relocate asset" });
  }
};


// GET relocation history for all asset
exports.getRelocationHistory = async (req, res) => {
  try {
    const assetId = req.params.id;

    const history = await Relocation.findAll({
      where: { assetId },
      order: [['relocatedAt', 'DESC']]
    });

    return res.status(200).json(history);

  } catch (error) {
    console.error('❌ Fetch relocation history error:', error);
    return res.status(500).json({ error: 'Failed to fetch relocation history' });
  }
};




// Delete asset
exports.deleteAsset = async (req, res) => {
  try {
    const id = req.params.id;
    const asset = await Asset.findByPk(id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    await asset.destroy();
    return res.json({ message: 'Asset deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete asset' });
  }
};

//Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalAssets = await Asset.count();

    res.json({
      totalAssets
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};
exports.getAssetsByCategory = async (req, res) => {
  try {
    const itemName = req.params.itemName;

    const assets = await Asset.findAll({
      where: {
        itemName: itemName
      }
    });

    res.status(200).json(assets);

  } catch (err) {
    console.error("Error fetching category assets:", err);
    res.status(500).json({
      error: "Failed to fetch assets"
    });
  }
};