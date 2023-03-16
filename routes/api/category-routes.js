const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

// make async
router.get("/", async (req, res) => {
	// try catch block for findAll
	try {
		// find all categories
		const categoryData = await Category.findAll({
			// including its associated Products (JOIN)
			include: [{ model: Product }],
		});
		res.status(200).json(categoryData);
		// catch err
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/:id", async (req, res) => {
	try {
		// using findByPk and req.params.id to find one category by its `id` value
		const categoryData = await Category.findByPk(req.params.id, {
			// including its associated Products (JOIN)
			include: [{ model: Product }],
		});

		// if no categoryData, 404 error, else 200
		if (!categoryData) {
			res.status(404).json({ message: "There's no category with that id!" });
		} else {
			res.status(200).json(categoryData);
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

router.post("/", async (req, res) => {
	// create a new category
	try {
		const newCategory = await Category.create({
			reader_id: req.body.reader_id,
		});
		res.status(200).json(newCategory);
	} catch (err) {
		res.status(400).json(err);
	}
});

router.put("/:id", (req, res) => {
	// update a category by its `id` value
});

router.delete("/:id", (req, res) => {
	// delete a category by its `id` value
});

module.exports = router;
