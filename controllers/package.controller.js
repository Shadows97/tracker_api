const Package = require('../../tracker_api/models/package.model');
const uuid = require('uuid');




// Créer un nouveau package
exports.createPackage = async (req, res) => {
  // #swagger.tags = ['Package']
  
  /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Add a package',
                schema: { $ref: '#/definitions/PackageInput' }
        } */

  try {
    let packageData = req.body;

    
      // Générer un package_id unique
      const generatedPackageId = uuid.v4(); // Remplace cette ligne par la logique réelle de génération
      packageData.package_id = generatedPackageId;
    

    const newPackage = await Package.create(packageData);
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la création du package.' });
  }
};


// Obtenir la liste de tous les packages
exports.getAllPackages = async (req, res) => {
  // #swagger.tags = ['Package']
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des packages.' });
  }
};

// Obtenir un package par son ID
exports.getPackageById = async (req, res) => {
  // #swagger.tags = ['Package']
  const packageId = req.params.id;
  try {
    const package = await Package.findOne({package_id: packageId});
    if (!package) {
      return res.status(404).json({ error: 'Package non trouvé.' });
    }
    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du package.' });
  }
};

// Mettre à jour un package par son ID
exports.updatePackage = async (req, res) => {
  // #swagger.tags = ['Package']

   /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Update a package',
                schema: { $ref: '#/definitions/PackageInput' }
        } */
  const packageId = req.params.id;
  try {
    const updatedPackage = await Package.findOneAndUpdate(
      {package_id: packageId}, req.body, { new: true });
    if (!updatedPackage) {
      return res.status(404).json({ error: 'Package non trouvé.' });
    }
    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du package.' });
  }
};

// Supprimer un package par son ID
exports.deletePackage = async (req, res) => {
  // #swagger.tags = ['Package']
  const packageId = req.params.id;
  try {
    const deletedPackage = await Package.findOneAndDelete({package_id: packageId});
    if (!deletedPackage) {
      return res.status(404).json({ error: 'Package non trouvé.' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du package.' });
  }
};
