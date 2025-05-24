import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // For filtering

  // State for editing a product
  const [editingProduct, setEditingProduct] = useState(null);

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

  // Edit handler – set the selected product for editing
  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  // Update handler – send updated product info to Firebase
  const handleUpdate = async () => {
    if (!editingProduct) return;
    try {
      const updateUrl = `https://furni-c5aaa-default-rtdb.firebaseio.com/products/${editingProduct.id}.json`;
      await axios.put(updateUrl, editingProduct);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) {
    return (
      <p className="d-flex justify-content-center text-dark fw-bold">
        Loading products...
      </p>
    );
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
        {filteredProducts.length === 0 ? (
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
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
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

      {/* Edit Product Modal */}
      <Modal
        show={editingProduct !== null}
        onHide={() => setEditingProduct(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingProduct && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingProduct.productName}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      productName: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  value={editingProduct.mainCategory}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      mainCategory: e.target.value,
                    })
                  }
                />
              </Form.Group>
              {editingProduct.quantity !== undefined && (
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={editingProduct.quantity}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        quantity: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              )}
              {editingProduct.description !== undefined && (
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              )}
              {editingProduct.imageUrl !== undefined && (
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    value={editingProduct.imageUrl}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        imageUrl: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditingProduct(null)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Products;
