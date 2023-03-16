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
		// validate for appropriate request
		if (!req.body.id) {
			res.status.json(400).json({ error: "id is required" });
		} else {
			// INSERT new entry
			const newCategory = await Category.create({
				id: req.body.id,
			});
			res.status(200).json(newCategory);
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

router.put("/:id", async (req, res) => {
	// update a category by its `id` value
	try {
		const categoryData = await Category.findByPk(req.params.id);

		// if no categoryData, 404 error
		if (!categoryData) {
			res.status(404).json({ message: "There's no category with that id!" });
		} else {
			const { category_name } = req.body;

			// if category_name exists after destructuring, continue
			if (category_name) {
				// set new name (UPDATE)
				categoryData.set({
					name: category_name,
				});

				res.status(200).json(categoryData);
			} else {
				res.status(400).json({ message: "Must include a category name!" });
			}
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const categoryData = await Category.destroy({
			where: {
				id: req.params.id,
			},
		});

		if (!categoryData) {
			res.status(404).json({ message: "No category found with that id!" });
		}

		res.status(200).json(categoryData);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
