const Item = require("../models/item.model.js");

const saveNewItem = async (req, res) => {
  const item = await Item.create({ ...req.body, userId: req.user._id });
  res.status(201).json(item);
};

const getAllItems = async (req, res) => {
  const { type, format, category, search } = req.query;
  const filter = { userId: req.user._id };
  if (type) filter.type = type;
  if (format) filter.format = format;
  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: "i" };
  const items = await Item.find(filter).sort({ createdAt: -1 });
  res.json(items);
};

const deleteItem = async (req, res) => {
  await Item.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  res.json({ message: "Deleted" });
};

module.exports = { saveNewItem, getAllItems, deleteItem };
