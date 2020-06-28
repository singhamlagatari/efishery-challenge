const privateRoutes = {
  'GET /users': 'UserController.getAll',
  'GET /fetch': 'FetchController.index',
  'GET /aggregate': 'FetchController.aggregate',
};

module.exports = privateRoutes;
