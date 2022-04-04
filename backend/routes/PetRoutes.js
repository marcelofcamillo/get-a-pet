import express from 'express';
import PetController from '../controllers/PetController.js';

// middletares
import verifyToken from '../helpers/verify-token.js';
import imageUpload from '../helpers/image.upload.js';

const router = express.Router();

router.post(
  '/create',
  verifyToken,
  imageUpload.array('images'),
  PetController.create
);
router.get('/', PetController.getAll);
router.get('/mypets', verifyToken, PetController.getAllUserPets);
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions);
router.get('/:id', PetController.getPetById);
router.delete('/:id', verifyToken, PetController.removePetById);
router.patch(
  '/:id',
  verifyToken,
  imageUpload.array('images'),
  PetController.updatePet
);
router.patch('/schedule/:id', verifyToken, PetController.schedule);
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption);

export default router;
