const Delivery = require('../../tracker_api/models/delivery.model');
const uuid = require('uuid');

// Créer une nouvelle livraison
exports.createDelivery = async (req, res) => {

   // #swagger.tags = ['Delivery']

  /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Add a delivery',
                schema: { $ref: '#/definitions/DeliveryInput' }
        } */
  try {
    let deliveryData = req.body;

    // Vérifier si package_id est fourni, sinon en générer un
    if (!deliveryData.delivery_id) {
      // Générer un package_id unique
      const generatedDeliveryId = uuid.v4(); // Remplace cette ligne par la logique réelle de génération
      deliveryData.delivery_id = generatedDeliveryId;
    }
    const newDelivery = await Delivery.create(req.body);
    res.status(201).json(newDelivery);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la création de la livraison.' });
  }
};

// Obtenir la liste de toutes les livraisons
exports.getAllDeliveries = async (req, res) => {
  // #swagger.tags = ['Delivery']
  try {
    const deliveries = await Delivery.find();
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des livraisons.' });
  }
};

// Obtenir une livraison par son ID
exports.getDeliveryById = async (req, res) => {
  // #swagger.tags = ['Delivery']
  const deliveryId = req.params.id;
  try {
    const delivery = await Delivery.findOne({delivery_id: deliveryId});
    if (!delivery) {
      return res.status(404).json({ error: 'Livraison non trouvée.' });
    }
    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la livraison.' });
  }
};

// Mettre à jour une livraison par son ID
exports.updateDelivery = async (req, res) => {
  // #swagger.tags = ['Delivery']

   /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Update a delivery',
                schema: { $ref: '#/definitions/DeliveryInput' }
        } */
  const deliveryId = req.params.id;
  const newData = req.body; // Données à mettre à jour

  try {
    const existingDelivery = await Delivery.findOne({ delivery_id: deliveryId });

    if (!existingDelivery) {
      return res.status(404).json({ error: 'Livraison non trouvée.' });
    }

    

    // Mettre à jour la livraison
    const updatedDelivery = await Delivery.findOneAndUpdate(
      { delivery_id: deliveryId }, newData, { new: true }
    );

    // Vérifier si la propriété "location" ou "status" est modifiée
    if (
      newData.location !== undefined ||
      newData.status !== undefined
    ) {
      // Effectuer une action spécifique ici
      if (newData.location) {
        req.io.emit("update", {event: "location_changed", delivery_id: updatedDelivery.delivery_id, location: updatedDelivery.location})
      }
      if (newData.status) {
        req.io.emit("update", {event: "status_changed", delivery_id: updatedDelivery.delivery_id, status: updatedDelivery.status})
      }
    }
    req.io.emit("update", {event: "delivery_updated", delivery_object: updatedDelivery})
    res.status(200).json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la livraison.' });
  }
};


// Supprimer une livraison par son ID
exports.deleteDelivery = async (req, res) => {
  // #swagger.tags = ['Delivery']
  const deliveryId = req.params.id;
  try {
    const deletedDelivery = await Delivery.findOneAndDelete({delivery_id: deliveryId});
    if (!deletedDelivery) {
      return res.status(404).json({ error: 'Livraison non trouvée.' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de la livraison.' });
  }
};
