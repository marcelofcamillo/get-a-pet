import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

// helpers
import createUserToken from '../helpers/create-user-token.js';
import getToken from '../helpers/get-token.js';
import getUserByToken from '../helpers/get-user-by-token.js';

class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmPassword } = req.body;

    // validations
    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório!' });
      return;
    }

    if (!email) {
      res.status(422).json({ message: 'O e-mail é obrigatório!' });
      return;
    }

    if (!phone) {
      res.status(422).json({ message: 'O telefone é obrigatório!' });
      return;
    }

    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória!' });
      return;
    }

    if (!confirmPassword) {
      res
        .status(422)
        .json({ message: 'A confirmação de senha é obrigatória!' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(422).json({ message: 'As senhas não conferem!' });
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      res.status(422).json({ message: 'E-mail já cadastrado!' });
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

  static async login(req, res) {
    const { email, password } = req.body;

    // validations
    if (!email) {
      res.status(422).json({ message: 'O e-mail é obrigatório!' });
      return;
    }

    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória!' });
      return;
    }

    // check if user exists
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(422).json({ message: 'Usuário não cadastrado!' });
      return;
    }

    // check if passord match with db password
    const checkPassord = await bcrypt.compare(password, user.password);

    if (!checkPassord) {
      res.status(422).json({ message: 'Senha inválida!' });
      return;
    }

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, process.env.SECRET);

      currentUser = await User.findById(decoded.id);
      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select('-password');

    if (!user) {
      res.status(422).json({ message: 'Usuário não encontrado!' });
      return;
    }

    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const id = req.params.id;
    const { name, email, phone, password, confirmPassword } = req.body;
    let image = '';

    // check if user exists
    const token = getToken(req);
    const user = await getUserByToken(token);

    // validations
    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório!' });
      return;
    }

    user.name = name;

    if (!email) {
      res.status(422).json({ message: 'O e-mail é obrigatório!' });
      return;
    }

    // check if email has already taken
    const userExists = await User.findOne({ email: email });

    if (user.email !== email && userExists) {
      res.status(422).json({ message: 'E-mail já está sendo utilizado!' });
      return;
    }

    user.email = email;

    if (!phone) {
      res.status(422).json({ message: 'O telefone é obrigatório!' });
      return;
    }

    user.phone = phone;

    if (password !== confirmPassword) {
      res.status(422).json({ message: 'As senhas não conferem!' });
      return;
    } else if (password === confirmPassword && password !== null) {
      // creating password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash;
    }

    try {
      // returns user updated data
      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );

      res.status(200).json({ message: 'Dados alterados com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: error });
      return;
    }
  }
}

export default UserController;
