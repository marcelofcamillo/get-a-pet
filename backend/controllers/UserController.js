import bcrypt from 'bcrypt';
import User from '../models/User.js';
import createUserToken from '../helpers/create-user-token.js';

class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmPassword } = req.body;

    // validations
    if (!name) {
      res.status(402).json({ message: 'O nome é obrigatório!' });
      return;
    }

    if (!email) {
      res.status(402).json({ message: 'O e-mail é obrigatório!' });
      return;
    }

    if (!phone) {
      res.status(402).json({ message: 'O telefone é obrigatório!' });
      return;
    }

    if (!password) {
      res.status(402).json({ message: 'A senha é obrigatória!' });
      return;
    }

    if (!confirmPassword) {
      res
        .status(402)
        .json({ message: 'A confirmação de senha é obrigatória!' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(402).json({ message: 'As senhas não conferem!' });
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      res.status(402).json({ message: 'E-mail já cadastrado!' });
      return;
    }

    // create a password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // create user
    const user = new User({
      name,
      email,
      phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();

      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}

export default UserController;
