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

  // Form state, including an 'image' field to hold the download URL from the REST API.
  const [formState, setFormState] = useState({
    mainCategory: "",
    subCategory: "",
    childCategory: "",
    name: "",
    description: "",
    price: "",
    image: "", // This will store the URL returned by the API after uploading
    dimensions: "",
    material: "",
  });

  // Pre-fill form fields in edit mode (simulation)
  useEffect(() => {
    if (id) {
      // In a real application, fetch product details by id and set them here.
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

  // Input change handler
  const handleChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // When main category changes, reset sub and child selections.
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

  // Handle file selection and upload using a REST API endpoint.
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Replace the URL below with your REST API endpoint for file uploads.
        const response = await fetch("https://api.example.com/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Error uploading image");
        }

        const data = await response.json();
        // Expect the API to return { downloadUrl: "https://..." }
        setFormState((prev) => ({
          ...prev,
          image: data.downloadUrl,
        }));
      } catch (error) {
        console.error("Error during file upload:", error);
      }
    }
  };

  // Submit handler to either create or update a product.
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the formState (including the image URL) to your backend via REST API.
    if (id) {
      console.log("Updating product:", formState);
    } else {
      console.log("Creating product:", formState);
    }
    navigate("/products");
  };

  // Determine available child category options based on main and sub categories.
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

                {/* File Upload for Image */}
                <Form.Group controlId="imageFile" className="mb-3">
                  <Form.Label>Upload Product Image</Form.Label>
                  <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>

                {/* Preview uploaded image */}
                {formState.image && (
                  <div className="mb-3">
                    <img
                      src={formState.image}
                      alt="Product"
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}

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
