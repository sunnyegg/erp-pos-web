import React, { useState } from "react";
import Axios from "axios";
import storage from "local-storage";
import Rupiah from "rupiah-format";
import { Redirect, Link } from "react-router-dom";

import { Table } from "reactstrap";

const OrdersPage = props => {
  const [Orders, setOrders] = useState([]);
  const data = storage.get("cart");
  console.log(data);

  return (
    <div>
      {data.map(orders => {
        return (
          <Table>
            <thead>
              <tr>
                <th>Menu ID</th>
                <th>Customer Name</th>
                <th>Order Table</th>
                <th>Menu Name</th>
                <th>Menu Price</th>
                <th>Order Quantity</th>
              </tr>
            </thead>
          </Table>
        );
      })}
    </div>
  );
};

export default OrdersPage;
