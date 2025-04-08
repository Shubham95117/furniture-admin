// src/pages/ProductForm.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

// Example hierarchical category options
const categoryOptions = {
  "living-room": {
    chairs: ["kids-chair", "plastic-chair"],
    sofas: [], // sofas have no further nested categories
  },
  bedroom: {
    wardrobes: [], // wardrobes are a single level
  },
};

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initialize form state. In edit mode you would pre-populate these.
  const [formState, setFormState] = useState({
    mainCategory: "",
    subCategory: "",
    childCategory: "", // used if sub-category has nested options
    name: "",
    description: "",
    price: "",
    image: "",
    dimensions: "",
    material: "",
  });

  // Simulate pre-filled data when editing an existing product.
  useEffect(() => {
    if (id) {
      // Replace with a fetch call for product details
      setFormState({
        mainCategory: "living-room",
        subCategory: "chairs",
        childCategory: "kids-chair",
        name: "Kids Plastic Chair",
        description: "A colorful chair for kids",
        price: "79.99",
        image: "https://cdn.example.com/kids-plastic-chair.jpg",
        dimensions: "25x25x45",
        material: "High-grade Plastic",
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Clear sub-category and child when mainCategory changes
  const handleMainCategoryChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      mainCategory: e.target.value,
      subCategory: "",
      childCategory: "",
    }));
  };

  const handleSubCategoryChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      subCategory: e.target.value,
      childCategory: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      // Update product logic here (e.g., API call)
      console.log("Updating product:", formState);
    } else {
      // Create product logic here
      console.log("Creating product:", formState);
    }
    navigate("/products");
  };

  // Determine child category options based on selections
  const childOptions =
    formState.mainCategory &&
    formState.subCategory &&
    Array.isArray(
      categoryOptions[formState.mainCategory][formState.subCategory]
    )
      ? categoryOptions[formState.mainCategory][formState.subCategory]
      : [];

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">
                {id ? "Edit Product" : "Add New Product"}
              </h2>
              <Form onSubmit={handleSubmit}>
                {/* Main Category */}
                <Form.Group controlId="mainCategory" className="mb-3">
                  <Form.Label>Main Category</Form.Label>
                  <Form.Select
                    name="mainCategory"
                    value={formState.mainCategory}
                    onChange={handleMainCategoryChange}
                    required
                  >
                    <option value="">-- Select Main Category --</option>
                    {Object.keys(categoryOptions).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Sub Category */}
                {formState.mainCategory && (
                  <Form.Group controlId="subCategory" className="mb-3">
                    <Form.Label>Sub Category</Form.Label>
                    <Form.Select
                      name="subCategory"
                      value={formState.subCategory}
                      onChange={handleSubCategoryChange}
                      required
                    >
                      <option value="">-- Select Sub Category --</option>
                      {Object.keys(categoryOptions[formState.mainCategory]).map(
                        (subCat) => (
                          <option key={subCat} value={subCat}>
                            {subCat}
                          </option>
                        )
                      )}
                    </Form.Select>
                  </Form.Group>
                )}

                {/* Child Category */}
                {childOptions.length > 0 && (
                  <Form.Group controlId="childCategory" className="mb-3">
                    <Form.Label>Child Category</Form.Label>
                    <Form.Select
                      name="childCategory"
                      value={formState.childCategory}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Child Category --</option>
                      {childOptions.map((childCat) => (
                        <option key={childCat} value={childCat}>
                          {childCat}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}

                {/* Product Details */}
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="description" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formState.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="price" className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="price"
                    value={formState.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="image" className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="image"
                    value={formState.image}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="dimensions" className="mb-3">
                  <Form.Label>Dimensions</Form.Label>
                  <Form.Control
                    type="text"
                    name="dimensions"
                    value={formState.dimensions}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="material" className="mb-3">
                  <Form.Label>Material</Form.Label>
                  <Form.Control
                    type="text"
                    name="material"
                    value={formState.material}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100">
                  {id ? "Update Product" : "Add Product"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductForm;
