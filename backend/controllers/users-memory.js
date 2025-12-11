const users = [];

module.exports = {
  cget: (req, res, next) => {
    res.json(users);
  },
  create: (req, res, next) => {
    const data = {
      ...req.body,
      id: Date.now(),
    };
    users.push(data);
    res.status(201).json(data);
  },
  get: (req, res, next) => {
    const user = users.find((u) => u.id === parseInt(req.params.id, 10));
    if (!user) {
      return res.sendStatus(404);
    }
    res.json(user);
  },
  update: (req, res, next) => {
    const userIndex = users.findIndex(
      (u) => u.id === parseInt(req.params.id, 10)
    );
    if (userIndex === -1) {
      return res.sendStatus(404);
    }
    const updatedUser = { ...users[userIndex], ...req.body };
    users[userIndex] = updatedUser;
    res.json(updatedUser);
  },
  delete: (req, res, next) => {
    const userIndex = users.findIndex(
      (u) => u.id === parseInt(req.params.id, 10)
    );
    if (userIndex === -1) {
      return res.sendStatus(404);
    }
    users.splice(userIndex, 1);
    res.sendStatus(204);
  },
};