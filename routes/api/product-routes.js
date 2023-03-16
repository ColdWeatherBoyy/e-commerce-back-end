const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
	// try catch block for findAll
	try {
		// find all products
		const productData = await Product.findAll({
			// including its associated Category and Tag data
			include: [{ model: Category }, { model: Tag }],
		});
		res.status(200).json(productData);
		// catch err
	} catch (err) {
		res.status(500).json(err);
	}
});

// get one product
router.get("/:id", async (req, res) => {
	try {
		// using findByPk and req.params.id to find one category by its `id` value
		const productData = await Product.findByPk(req.params.id, {
			// including its associated Category and Tag data (JOIN)
			include: [{ model: Category }, { model: Tag }],
		});

		// if no productData, 404 error, else 200
		if (!productData) {
			res.status(404).json({ message: "There's no product with that id!" });
		} else {
			res.status(200).json(productData);
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// create new product
router.post("/", (req, res) => {
	/* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
	Product.create(req.body)
		.then((product) => {
			// if there's product tags, we need to create pairings to bulk create in the ProductTag model
			if (req.body.tagIds.length) {
				const productTagIdArr = req.body.tagIds.map((tag_id) => {
					return {
						product_id: product.id,
						tag_id,
					};
				});
				return ProductTag.bulkCreate(productTagIdArr);
			}
			// if no product tags, just respond
			res.status(200).json(product);
		})
		.then((productTagIds) => res.status(200).json(productTagIds))
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
});

// update product
router.put("/:id", (req, res) => {
	// update product data
	Product.update(req.body, {
		where: {
			id: req.params.id,
		},
	})
		.then((product) => {
			// find all associated tags from ProductTag
			return ProductTag.findAll({ where: { product_id: req.params.id } });
		})
		.then((productTags) => {
			// get list of current tag_ids
			const productTagIds = productTags.map(({ tag_id }) => tag_id);
			// create filtered list of new tag_ids
			const newProductTags = req.body.tagIds
				.filter((tag_id) => !productTagIds.includes(tag_id))
				.map((tag_id) => {
					return {
						product_id: req.params.id,
						tag_id,
					};
				});
			// figure out which ones to remove
			const productTagsToRemove = productTags
				.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
				.map(({ id }) => id);

			// run both actions
			return Promise.all([
				ProductTag.destroy({ where: { id: productTagsToRemove } }),
				ProductTag.bulkCreate(newProductTags),
			]);
		})
		.then((updatedProductTags) => res.json(updatedProductTags))
		.catch((err) => {
			// console.log(err);
			res.status(400).json(err);
		});
});

router.delete("/:id", (req, res) => {
	// delete one product by its `id` value
});

module.exports = router;
