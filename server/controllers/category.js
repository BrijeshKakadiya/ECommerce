const Category = require("../models/category");
const Product = require("../models/product");
const Sub = require("../models/sub");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    // const category = await new Category({
    //   name,
    //   slug: slugify(name).toLowerCase(),
    // }).save();
    res.json(
      await new Category({
        name,
        slug: slugify(name).toLowerCase(),
      }).save()
    );
  } catch (error) {
    // console.log(error);
    res.status(400).send("Category category failed");
  }
};

exports.list = async (req, res) =>
  res.json(await Category.find({}).sort({ createdAt: -1 }).exec());

exports.read = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec();
  // res.json(category);
  const products = await Product.find({ category }).populate("category").exec();

  res.json({ category, products });
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    let updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).send("Category update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (error) {
    res.status(400).send("Create delete failed");
  }
};

exports.getSubs = async (req, res) => {
  try {
    const find = await Sub.find({ parent: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
