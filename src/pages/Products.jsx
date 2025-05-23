import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // For filtering

  // Firebase endpoint for "products" node
  const api = "https://furni-c5aaa-default-rtdb.firebaseio.com/products.json";

  const fetchProducts = async () => {
    try {
      const response = await axios.get(api);
      const data = response.data;
      const loadedProducts = data
        ? Object.entries(data).map(([id, product]) => ({ id, ...product }))
        : [];
      setProducts(loadedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [api]);

  // Callback to refresh products when a new product is added
  const handleProductAdded = () => {
    fetchProducts();
  };

  // Delete handler
  const handleDelete = async (id) => {
    try {
      const deleteUrl = `https://furni-c5aaa-default-rtdb.firebaseio.com/products/${id}.json`;
      await axios.delete(deleteUrl);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  // Filter products based on selected category (if chosen)
  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product.mainCategory &&
          product.mainCategory.toLowerCase() === selectedCategory.toLowerCase()
      )
    : products;

  return (
    <Container className="mt-5">
      {/* Header with Add Product button and Filter dropdown */}
      <Row className="mb-4 align-items-center">
        <Col md={4}>
          {!showProductForm && (
            <Button variant="primary" onClick={() => setShowProductForm(true)}>
              Add Product
            </Button>
          )}
        </Col>
        <Col md={{ span: 4, offset: 4 }}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="living room">Living Room</option>
            <option value="bedroom">Bedroom</option>
            <option value="office">Office</option>
          </Form.Select>
        </Col>
      </Row>

      {/* ProductForm section */}
      {showProductForm && (
        <Row className="mb-4">
          <Col>
            <ProductForm
              setShowProductForm={setShowProductForm}
              onProductAdded={handleProductAdded}
            />
          </Col>
        </Row>
      )}

      {/* Products Grid */}
      <Row>
        {filteredProducts.length == 0 ? (
          <h2 className="d-flex justify-content-center">No products found</h2>
        ) : (
          filteredProducts.map((product) => (
            <Col key={product.id} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                {product.imageUrl && (
                  <Card.Img
                    variant="top"
                    src={product.imageUrl}
                    alt={product.productName}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{product.productName}</Card.Title>
                  <Card.Text>
                    <strong>Category:</strong>{" "}
                    {product.mainCategory || product.category || "N/A"}
                  </Card.Text>
                  {product.quantity && (
                    <Card.Text>
                      <strong>Quantity:</strong> {product.quantity}
                    </Card.Text>
                  )}
                  {product.description && (
                    <Card.Text>
                      <strong>Description:</strong> {product.description}
                    </Card.Text>
                  )}
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between">
                  <Button variant="outline-primary" size="sm">
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Products;
