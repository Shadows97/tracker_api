const express = require('express');
const router = express.Router();
const packageController = require('../controllers/package.controller');

// Créer un nouveau package
router.post('/packages', packageController.createPackage);

// Obtenir la liste de tous les packages
router.get('/packages', packageController.getAllPackages);

// Obtenir un package par son ID
router.get('/packages/:id', packageController.getPackageById);

// Mettre à jour un package par son ID
router.put('/packages/:id', packageController.updatePackage);

// Supprimer un package par son ID
router.delete('/packages/:id', packageController.deletePackage);

module.exports = router;
