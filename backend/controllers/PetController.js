import Pet from '../models/Pet.js';

class PetController {
  // create a pet
  static async create(req, res) {
    res.json({ message: 'Ok' });
  }
}

export default PetController;
