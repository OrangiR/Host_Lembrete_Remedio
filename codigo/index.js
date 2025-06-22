const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db/db.json');

// Middlewares
const middlewares = jsonServer.defaults({ noCors: true });
server.use(middlewares);

// Serve index.html manually (optional)
server.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Your custom routes or logic can go here

// Mount router AFTER custom middleware
server.use(router);

// Custom 404 handler — should go LAST
server.use((req, res) => {
  res.status(404).json({ error: 'not found' });
});


server.listen(3000, () => {
  console.log(`JSON Server is running em http://localhost:3000`)
})