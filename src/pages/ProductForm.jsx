import axios from "axios";
import React, { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";

const ProductForm = ({ setShowProductForm, onProductAdded }) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [variant, setVariant] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Firebase Realtime Database API endpoint
  const api = "https://furni-c5aaa-default-rtdb.firebaseio.com";

  // Cloudinary configuration
  const cloudName = "dnnsdxsoi"; // Replace with your Cloudinary cloud name
  const uploadPreset = "ml_default"; // Replace with your unsigned upload preset

  // Mapping for category to its subcategories and variants
  const categories = {
    "living room": {
      subCategories: {
        sofas: ["2 seater", "3 seater"],
        chairs: ["plastic", "kid"],
      },
    },
    bedroom: {
      subCategories: {
        wardrobe: ["1 door", "2 door"],
        mattress: ["king size", "queen size"],
      },
    },
    office: {
      subCategories: {
        offficeTables: ["laptop table", "desk"],
        chairs: ["office chairs", "gaming chairs"],
      },
    },
  };

  // Returns an array of subcategory names for the selected main category
  const getSubCategories = () => {
    if (mainCategory && categories[mainCategory].subCategories) {
      return Object.keys(categories[mainCategory].subCategories);
    }
    return [];
  };

  // Returns an array of variant options for the selected subcategory
  const getVariants = () => {
    if (
      mainCategory &&
      subCategory &&
      categories[mainCategory].subCategories[subCategory]
    ) {
      return categories[mainCategory].subCategories[subCategory];
    }
    return [];
  };

  const handleMainCategoryChange = (e) => {
    setMainCategory(e.target.value);
    // Reset selections for subcategory and variant when main category changes
    setSubCategory("");
    setVariant("");
  };

  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
    // Reset variant when subcategory changes
    setVariant("");
  };

  // Handler for image file upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      setUploading(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        formData
      );
      setImageUrl(res.data.secure_url);
      console.log("Image uploaded:", res.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build the product object including the new fields
    const newProduct = {
      productName,
      description,
      mainCategory,
      subCategory,
      variant,
      quantity,
      imageUrl, // May be an empty string if no image was uploaded
    };

    try {
      const response = await axios.post(`${api}/products.json`, newProduct);
      console.log("Product added:", response.data);
      // Trigger the parent callback to refresh the products list
      if (onProductAdded) {
        onProductAdded();
      }
      // Hide the form after successful submission
      setShowProductForm(false);
    } catch (error) {
      console.error("Error posting product:", error);
    }

    // Reset form fields after submission
    setProductName("");
    setDescription("");
    setMainCategory("");
    setSubCategory("");
    setVariant("");
    setQuantity("");
    setImageUrl("");
  };

  return (
    <Row className="justify-content-center mt-4">
      <Col md={6}>
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">Add New Product</h4>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                {/* Product Name */}
                <Form.Group as={Col} xs={12} controlId="productName">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mt-3">
                {/* Description */}
                <Form.Group as={Col} xs={12} controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter product description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mt-3">
                {/* Main Category */}
                <Form.Group as={Col} md={4} controlId="mainCategory">
                  <Form.Label>Main Category</Form.Label>
                  <Form.Select
                    value={mainCategory}
                    onChange={handleMainCategoryChange}
                    required
                  >
                    <option value="">Select Main Category</option>
                    <option value="living room">Living Room</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="office">Office</option>
                  </Form.Select>
                </Form.Group>

                {/* Sub Category */}
                {mainCategory &&
                  Object.keys(categories[mainCategory].subCategories).length >
                    0 && (
                    <Form.Group as={Col} md={4} controlId="subCategory">
                      <Form.Label>Sub Category</Form.Label>
                      <Form.Select
                        value={subCategory}
                        onChange={handleSubCategoryChange}
                        required
                      >
                        <option value="">Select Sub Category</option>
                        {getSubCategories().map((subCat) => (
                          <option key={subCat} value={subCat}>
                            {subCat.charAt(0).toUpperCase() + subCat.slice(1)}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  )}

                {/* Variant */}
                {mainCategory && subCategory && getVariants().length > 0 && (
                  <Form.Group as={Col} md={4} controlId="variant">
                    <Form.Label>Variant</Form.Label>
                    <Form.Select
                      value={variant}
                      onChange={(e) => setVariant(e.target.value)}
                      required
                    >
                      <option value="">Select Variant</option>
                      {getVariants().map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
              </Row>
              <Row className="mt-3">
                {/* Quantity */}
                <Form.Group as={Col} md={6} controlId="quantity">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter product quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </Form.Group>
                {/* Image Upload */}
                <Form.Group as={Col} md={6} controlId="image">
                  <Form.Label>Product Image</Form.Label>
                  <Form.Control type="file" onChange={handleImageUpload} />
                  {uploading && <p>Uploading image...</p>}
                  {imageUrl && (
                    <div className="mt-2">
                      <p className="mb-1">Image uploaded successfully.</p>
                      <img
                        src={imageUrl}
                        alt="Uploaded"
                        style={{
                          maxWidth: "150px",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  )}
                </Form.Group>
              </Row>
            </Form>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-end">
            <Button
              variant="primary"
              type="submit"
              onClick={handleSubmit}
              className="me-2"
            >
              Add Product
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowProductForm(false)}
            >
              Cancel
            </Button>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductForm;
