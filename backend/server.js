// server.js
const app = require('./app');

// ----- DÉMARRAGE LOCAL UNIQUEMENT -----
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
        console.log(`✅  API dispo sur http://localhost:${PORT}`)
    );
}

// Pour Vercel :
module.exports = app;