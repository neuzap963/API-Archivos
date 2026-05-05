import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  logMiddleware,
  homeMiddleware,
  uploadMiddleware,
  weatherMiddleware,
  registerMiddleware,
  loginMiddleware,
  usersMiddleware
} from './src/middlewares/auth.middleware.js';

const api = express();
const PORT = process.env.PORT || 3000;

// necessário para usar __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

api.use(express.json());
api.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// middleware global
api.use(logMiddleware);

// MULTER - Upload de imagens// 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/img');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploads = multer({ storage: storage });

// ROTAS GERAIS// 
api.get('/', homeMiddleware, (req, res) => {
  res.send('api conectada');
});


// API 1 - Upload

api.post('/profile', uploadMiddleware, uploads.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      erro: 'Nenhum ficheiro enviado'
    });
  }

  res.status(201).json({
    mensagem: 'arquivo enviado',
    ficheiro: req.file.filename,
    caminho: `/uploads/img/${req.file.filename}`
  });
});


// API 2 - Meteorologia// 

// listar todas as cidades
api.get('/weather', weatherMiddleware, (req, res) => {
  res.json(weatherData);
});
const weatherData = [
  { cidade: 'Lisboa', temperatura: 22, estado: 'sol' },
  { cidade: 'Porto', temperatura: 18, estado: 'nublado' },
  { cidade: 'Coimbra', temperatura: 20, estado: 'chuva fraca' }
];


// procurar meteorologia por cidade
api.get('/weather/cidade', weatherMiddleware, (req, res) => {
  const cidade = req.params.cidade.toLowerCase();

  const resultado = weatherData.find(
    item => item.cidade.toLowerCase() === cidade
  );

  if (!resultado) {
    return res.status(404).json({
      erro: 'Cidade não encontrada'
    });
  }

  res.json(resultado);
});

// adicionar nova cidade
api.post('/weather', weatherMiddleware, (req, res) => {
  const { cidade, temperatura, estado } = req.body;

  const novaCidade = { cidade, temperatura, estado };
  weatherData.push(novaCidade);

  res.status(201).json({
    mensagem: 'Registo meteorológico criado com sucesso',
    dados: novaCidade
  });
});


// API 3 - Registo de utilizadores//

// listar utilizadores
api.get('/users', usersMiddleware, (req, res) => {
  res.json(users);
});
const users = [];

// registar utilizador
api.post('/register', registerMiddleware, (req, res) => {
  const { nome, email, password } = req.body;

  const existe = users.find(user => user.email === email);

  if (existe) {
    return res.status(409).json({
      erro: 'Já existe um utilizador com esse email'
    });
  }

  const novoUser = {
    id: users.length + 1,
    nome,
    email,
    password
  };

  users.push(novoUser);

  res.status(201).json({
    mensagem: 'Utilizador registado com sucesso',
    utilizador: novoUser
  });
});


// API 4 - Login// 

api.post('/login', loginMiddleware, (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      erro: 'Credenciais inválidas'
    });
  }

  res.json({
    mensagem: 'Login com sucesso',
    utilizador: {
      id: user.id,
      nome: user.nome,
      email: user.email
    }
  });
});

api.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
})