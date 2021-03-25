import React, { Component } from "react";
import { connect } from "react-redux";
import {
  successBuy,
  removeFromCart,
  removeOneFromCart,
  addToCart,
  userCartInfo,
} from "../actions/authActions";
import PropTypes from "prop-types";
import { Table, UncontrolledAlert, Button, Alert } from "reactstrap";
import { clearErrors } from "../actions/errorActions";

class Cart extends Component {
  state = {
    modal: false,
    msg: null,
    ShowTotal: false,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    cartInfo: PropTypes.object,
    clearErrors: PropTypes.func.isRequired,
    addToCart: PropTypes.func.isRequired,
    removeOneFromCart: PropTypes.func.isRequired,
    removeFromCart: PropTypes.func.isRequired,
    successBuy: PropTypes.func.isRequired,
    user: PropTypes.object,
    isLoading: PropTypes.bool,
    userCartInfo: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.userCartInfo();
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      this.props.userCartInfo();
    }
  }

  onDeleteClick = (id) => {
    this.props.removeFromCart(id);
  };

  onAddToCart = (id) => {
    this.props.addToCart(id);
  };

  onRemoveOneFromCart = (id) => {
    this.props.removeOneFromCart(id);
  };

  transactionSuccess = () => {
    let variables = {
      cartDetail: this.props.cartInfo.cartDetail,
    };
    this.props.successBuy(variables);
    this.setState({ ShowTotal: false });
  };

  render() {
    const cartInfo = this.props.cartInfo;
    return (
      <div className="container-fluid">
        {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}

        <div>
          {cartInfo && cartInfo.cartDetail.length > 0 ? (
            <div>
              <div className="table-responsive">
                <Table borderless>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Seller</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartInfo.cartDetail.map((item) => (
                      <tr key={item._id}>
                        <td>
                          {!item.images ? (
                            <div>
                              {" "}
                              <img
                                alt="cart"
                                className="image_comment"
                                src="https://via.placeholder.com/300x300/FFFFFF/000000/?text=syriashop.com"
                              />{" "}
                            </div>
                          ) : (
                            <div>
                              {item.images.length === 0 ? (
                                <img
                                  alt="cart"
                                  className="image_comment"
                                  src="https://via.placeholder.com/300x300/FFFFFF/000000/?text=syriashop.com"
                                />
                              ) : null}
                              {item.images.map((image) => (
                                <div key={item.images.indexOf(image)}>
                                  <img
                                    alt="cart"
                                    className="image_comment"
                                    src={image}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td>{item.name}</td>
                        <td>${item.price}</td>
                        <td>{item.writer.name}</td>
                        <td>
                          {" "}
                          <div className="d-inline-block">
                            {" "}
                            {item.quantity > 1 ? (
                              <span className="d-inline">
                                <Button
                                  className="fa fa-minus"
                                  color="success"
                                  size="sm"
                                  onClick={this.onRemoveOneFromCart.bind(
                                    this,
                                    item._id
                                  )}
                                ></Button>
                              </span>
                            ) : null}
                            <span className="font-weight-bold mr-1 ml-1 d-inline">
                              {item.quantity}
                            </span>
                            <span className="d-inline">
                              <Button
                                className="fa fa-plus"
                                color="success"
                                size="sm"
                                onClick={this.onAddToCart.bind(this, item._id)}
                              ></Button>
                            </span>
                          </div>
                        </td>
                        <td>${parseInt(item.price, 10) * item.quantity}</td>
                        <td>
                          <Button
                            className="fa fa-trash ml-2"
                            color="danger"
                            size="sm"
                            onClick={this.onDeleteClick.bind(this, item._id)}
                          ></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="ml-3 mr-3 mt-3">
                <span className="font-weight-bold">Total cost:</span>{" "}
                <span className="small">$</span>
                <span>
                  {cartInfo.cartDetail.reduce(
                    (total, item) =>
                      total + parseInt(item.price, 10) * item.quantity,
                    0
                  )}
                </span>
                <Button
                  className="ml-2"
                  color="success"
                  size="sm"
                  onClick={this.transactionSuccess.bind(this)}
                >
                  <span className="ml-1">Complete Purchase</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <UncontrolledAlert color="info">
                Ops! your cart is empty
              </UncontrolledAlert>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  user: state.auth.user,
  isLoading: state.auth.isLoading,
  cartInfo: state.auth.cartInfo,
});

export default connect(mapStateToProps, {
  successBuy,
  removeFromCart,
  removeOneFromCart,
  addToCart,
  userCartInfo,
  clearErrors,
})(Cart);
