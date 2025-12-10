// controllers/categories-controller.js
const { Category } = require('../models');

const categoriesController = {
  async list(req, res) {
    try {
      const categories = await Category.findAll({
        order: [['name', 'ASC']],
      });
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  },

  async create(req, res) {
    try {
      const { name, description } = req.body;

      const category = await Category.create({
        name,
        description,
      });

      res.status(201).json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
        error: 'A category with this name already exists',
        });
      }

      res.status(500).json({ error: 'Failed to create category' });
    }
  },
};

module.exports = categoriesController;
