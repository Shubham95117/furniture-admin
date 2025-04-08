// src/pages/Orders.js
import React from "react";

const Orders = () => {
  // Dummy order data – replace with your actual data source.
  const orders = [
    { id: 101, customer: "John Doe", status: "Pending" },
    { id: 102, customer: "Jane Smith", status: "Shipped" },
  ];

  const updateOrderStatus = (orderId, newStatus) => {
    // Replace with your API call or action dispatch for updating order status.
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  return (
    <div>
      <h2>Orders</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.status}</td>
              <td>
                <select
                  className="form-select"
                  defaultValue={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
