const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');

// Créer une nouvelle livraison
router.post('/deliveries', deliveryController.createDelivery);

// Obtenir la liste de toutes les livraisons
router.get('/deliveries', deliveryController.getAllDeliveries);

// Obtenir une livraison par son ID
router.get('/deliveries/:id', deliveryController.getDeliveryById);

// Mettre à jour une livraison par son ID
router.put('/deliveries/:id', deliveryController.updateDelivery);

// Supprimer une livraison par son ID
router.delete('/deliveries/:id', deliveryController.deleteDelivery);

module.exports = router;
