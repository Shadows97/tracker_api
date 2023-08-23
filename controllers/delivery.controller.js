const Delivery = require('../../tracker_api/models/delivery.model');
const Package = require('../../tracker_api/models/package.model');
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

      const generatedDeliveryId = uuid.v4();
      deliveryData.delivery_id = generatedDeliveryId;
    
    const newDelivery = await Delivery.create(req.body);

    const updatePackage = await Package.findOneAndUpdate(
      {package_id: newDelivery.package_id},{active_delivery_id: newDelivery.delivery_id})
    res.status(201).json(newDelivery);
  } catch (error) {
    if (error.name === 'ValidationError') {
      
      res.status(406).json({ message: 'Erreur de validation du corps de la requête.', error: error });
    } else {
      
      res.status(500).json({ error: 'Une erreur est survenue lors de la création de la livraison.' });
    }
    
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
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la livraison.', message: error });
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
  const newData = req.body;

  try {
    const existingDelivery = await Delivery.findOne({ delivery_id: deliveryId });

    if (!existingDelivery) {
      return res.status(404).json({ error: 'Livraison non trouvée.' });
    }

    
    const updatedDelivery = await Delivery.findOneAndUpdate(
      { delivery_id: deliveryId }, newData, { new: true }
    );

    if (newData.status !== undefined && newData.status !== existingDelivery.status) {
      if (newData.status === "picked-up") {
        updatedDelivery.pickup_time = new Date();
      } else if (newData.status === "in-transit" && existingDelivery.status === "picked-up") {
        updatedDelivery.start_time = new Date();
      } else if ((newData.status === "delivered" || newData.status === "failed") && existingDelivery.status === "in-transit") {
        updatedDelivery.end_time = new Date();
      }
    }

   
    await updatedDelivery.save();

    
    if (
      newData.location !== undefined ||
      newData.status !== undefined
    ) {
      
      if (newData.location) {
        req.io.emit("update", {event: "location_changed", delivery_id: updatedDelivery.delivery_id, location: updatedDelivery.location})
      }
      if (newData.status) {
        req.io.emit("update", {event: "status_changed", delivery_id: updatedDelivery.delivery_id, status: updatedDelivery.status})
      }
    }
    const updatePackage = await Package.findOneAndUpdate(
      {package_id: updatedDelivery.package_id},{active_delivery_id: updatedDelivery.delivery_id})
    req.io.emit("update", {event: "delivery_updated", delivery_object: updatedDelivery})
    res.status(200).json(updatedDelivery);
  } catch (error) {
    if (error.name === 'ValidationError') {
      
      res.status(406).json({ message: 'Erreur de validation du corps de la requête.', error: error });
    } else {
      
      res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la livraison.' });
    }
    
  
    
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

exports.updateStatus = async (deliveryId, newStatus) => {
  try {
    const updatedDelivery = await Delivery.findOneAndUpdate(
      { delivery_id: deliveryId },
      { status: newStatus },
      { new: true }
    );

    if (!updatedDelivery) {
      // Gérer le cas où la livraison n'est pas trouvée
      return null;
    }

    return updatedDelivery;
  } catch (error) {
    // Gérer les erreurs de mise à jour
    throw error;
  }
};

exports.updateLocation = async (deliveryId, newLocation) => {
  try {
    const updatedDelivery = await Delivery.findOneAndUpdate(
      { delivery_id: deliveryId },
      { location: newLocation },
      { new: true }
    );

    if (!updatedDelivery) {
      // Gérer le cas où la livraison n'est pas trouvée
      return null;
    }

    return updatedDelivery;
  } catch (error) {
    // Gérer les erreurs de mise à jour
    throw error;
  }
};


