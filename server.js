const express = require('express');
const app = express();
const agentesRouter = require('./routes/agentesRoutes');
const casosRouter = require('./routes/casosRoutes');
const errorHandler = require('./utils/errorHandler');
const PORT = 3000;

app.use(express.json());
app.use('/agentes', agentesRouter);
app.use('/casos', casosRouter);

// Adicione o error handler como último middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(
        `Servidor do Departamento de Polícia rodando em http://localhost:${PORT} em modo de desenvolvimento`,
    );
});
