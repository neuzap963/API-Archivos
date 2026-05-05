

export const logMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

export const homeMiddleware = (req, res, next) => {
  console.log('Middleware da rota / executado');
  next();
};

export const uploadMiddleware = (req, res, next) => {
  console.log('Middleware de upload executado');
  next();
};

export const weatherMiddleware = (req, res, next) => {
  if (req.method === 'POST') {
    const { cidade, temperatura, estado } = req.body;

    if (!cidade || temperatura === undefined || !estado) {
      return res.status(400).json({
        erro: 'Campos obrigatórios: cidade, temperatura, estado'
      });
    }
  }

  next();
};

export const registerMiddleware = (req, res, next) => {
  const { nome, email, password } = req.body;

  if (!nome || !email || !password) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: nome, email, password'
    });
  }

  next();
};

export const loginMiddleware = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: email e password'
    });
  }

  next();
};

export const usersMiddleware = (req, res, next) => {
  console.log('Middleware de utilizadores executado');
  next();
};