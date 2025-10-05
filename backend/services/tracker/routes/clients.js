const clients = require('../clients')

const clientsRoute = [
  {
    path: 'clients',
    method: 'GET',
    handler: clients.getClients,
    public: false,
  },
  {
    path: 'clients',
    method: 'POST',
    handler: clients.addClient,
    public: false,
  },
  {
    path: 'clients',
    method: 'PUT',
    handler: clients.updateClient,
    public: false,
  },
  {
    path: 'clients',
    method: 'DELETE',
    handler: clients.deleteClient,
    public: false,
  },
]

module.exports = clientsRoute
