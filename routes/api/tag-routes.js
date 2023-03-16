const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
	try {
		// find all tags
		const tagData = await Tag.findAll({
			// including its associated Products (JOIN)
			include: [{ model: Product }],
		});
		res.status(200).json(tagData);
		// catch err
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/:id", async (req, res) => {
	try {
		// using findByPk and req.params.id to find one tag by its `id` value
		const tagData = await Tag.findByPk(req.params.id, {
			// including its associated Products (JOIN)
			include: [{ model: Product }],
		});

		// if no tagData, 404 error, else 200
		if (!tagData) {
			res.status(404).json({ message: "There's no tag with that id!" });
		} else {
			res.status(200).json(tagData);
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

router.post("/", async (req, res) => {
	// create a new tag
	try {
		const { tag_name } = req.body;

		// validate for appropriate request
		if (!tag_name) {
			res.status.json(400).json({ error: "tag_name is required" });
		} else {
			// INSERT new entry
			const newTag = await Tag.create({
				tag_name,
			});
			res.status(200).json(newTag);
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

router.put("/:id", async (req, res) => {
	// update a tag's name by its `id` value
	try {
		const tagData = await Tag.findByPk(req.params.id);

		// if no tagData, 404 error
		if (!tagData) {
			return res.status(404).json({ message: "There's no tag with that id!" });
		}

		const { tag_name } = req.body;

		// if no tag_name provided, 400 error
		if (!tag_name) {
			return res.status(400).json({ message: "Must include a tag name!" });
		}

		// update if all good to go
		await tagData.update({ tag_name });

		res.status(200).json(tagData);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.delete("/:id", async (req, res) => {
	// delete on tag by its `id` value
	try {
		const tagData = await Tag.destroy({
			where: {
				id: req.params.id,
			},
		});

		if (!tagData) {
			res.status(404).json({ message: "No tag found with that id!" });
		}

		res.status(200).json(tagData);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
