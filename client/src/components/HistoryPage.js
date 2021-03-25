import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Container, Table } from "reactstrap";
import { useDispatch } from "react-redux";

function HistoryPage() {
  const [History, setHistory] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "ITEMS_LOADING" });
    Axios.get("/users/getHistory").then((response) => {
      if (response.data.success) {
        setHistory(response.data.history);
      };
    });
  }, [History]);

  return (
    <Container className="mt-3">
      <div>
        <h1 className="text-center text-secondary">History</h1>
      </div>
      <br />
      <div className="table-responsive">
        <Table striped>
          <thead>
            <tr className="text-info">
              <th></th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Date of Purchase</th>
            </tr>
          </thead>
          <tbody>
            {History.map((item, index) => (
              <tr key={index}>
                <th scope="row">{History.indexOf(item) + 1}</th>
                <td>{item.name}</td>
                <td>
                  <span className="font-weight-bold mr-1">$</span>
                  {item.price}
                </td>
                <td>{item.quantity}</td>
                <td>{item.dateOfPurchase}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default HistoryPage;
