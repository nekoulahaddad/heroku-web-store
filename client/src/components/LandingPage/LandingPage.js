import React, { useEffect, useState, useRef } from "react";
import Axios from "axios";
import SearchFeature from "./Sections/SearchFeature";
import {
  Col,
  Button,
  Card,
  CardImg,
  CardTitle,
  CardText,
  CardGroup,
  CardSubtitle,
  CardBody,
} from "reactstrap";
import ReactTimeAgo from "react-time-ago";
import { Link } from "react-router-dom";
import { addToCart, removeFromCart } from "../../actions/authActions";
import { useSelector, useDispatch } from "react-redux";

function LandingPage(props) {
  const refArray = React.useRef([]);
  const rArray = useRef([]);
  let isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const Limit = 8;
  const [PostSize, setPostSize] = useState();
  const [SearchTerms, setSearchTerms] = useState("");
  const img1 = "";

  const getProducts = (variables) => {
    Axios.post("/items/getProducts", variables).then((response) => {
      if (response.data.success) {
        if (variables.loadMore) {
          setProducts([...Products, ...response.data.products]);
        } else {
          setProducts(response.data.products);
        }
        setPostSize(response.data.postSize);
      } else {
        alert("Failed to fectch product datas");
      }
    });
  };

  useEffect(() => {
    const variables = {
      skip: Skip,
      limit: Limit,
    };

    getProducts(variables);
  }, []); 

  const onLoadMore = () => {
    let skip = Skip + Limit;

    const variables = {
      skip: skip,
      limit: Limit,
      loadMore: true,
    };
    getProducts(variables);
    setSkip(skip);
  };

  const changeColor = (id) => {
    refArray.current[id].classList.toggle("d-none");
    rArray.current[id].classList.toggle("d-none");
  };

  const onDeleteClick = (id) => {
    dispatch(removeFromCart(id));
  };

  const onAddToCart = (id) => {
    if (isAuthenticated) {
      dispatch(addToCart(id));
      if (rArray.current[0]) {
        console.log(rArray.current[0].current);
      }
    } else props.history.push("/SignIn");
  };

  const updateSearchTerms = (newSearchTerm) => {
    const variables = {
      skip: 0,
      limit: Limit,
      searchTerm: newSearchTerm,
    };

    setSkip(0);
    setSearchTerms(newSearchTerm);

    getProducts(variables);
  };

  return (
    <div className="mt-3">
      <div className="m-3">
        <SearchFeature refreshFunction={updateSearchTerms} />
      </div>

      {Products.length === 0 ? (
        <div className="m-3 d-flex justify-content-center">
          <h2>Loading...</h2>
        </div>
      ) : (
        <div>
          <CardGroup>
            {Products.map((item) => (
              <Col md={3} sm={6} key={item._id}>
                <Card className="m-2">
                  {item.images.length === 0 ? (
                    <Link
                      className="btn-link mr-3"
                      to={{
                        pathname: `/item/${item._id}`,
                        query: { item: item },
                      }}
                    >
                      <CardImg
                        className="img_item img-thumbnail"
                        top
                        width="100%"
                        src="https://via.placeholder.com/256x186/FFFFFF/000000/?text=myshop.com"
                      />
                    </Link>
                  ) : null}
                  {item.images.map((image) => (
                    <div key={item.images.indexOf(image)}>
                      <Link
                        className="btn-link mr-3"
                        to={{
                          pathname: `/item/${item._id}`,
                          query: { item: item },
                        }}
                      >
                        <CardImg
                          className="img_item img-thumbnail"
                          top
                          width="100%"
                          src={`${img1}${image}`}
                        />
                      </Link>
                    </div>
                  ))}
                  <CardBody>
                    <CardTitle>
                      <Link
                        className="btn-link mr-3"
                        to={{
                          pathname: `/item/${item._id}`,
                          query: { item: item },
                        }}
                      >
                        {item.name}
                      </Link>
                      {item.time ? (
                        <span>
                          <ReactTimeAgo date={item.date} locale="en" />
                        </span>
                      ) : null}
                    </CardTitle>

                    <CardSubtitle>
                      <span className="text-danger mr-3">
                        {" "}
                        Price: {item.price}${" "}
                      </span>
                      {item.price_sale ? (
                        <span className="last_price"> {item.price_sale}$ </span>
                      ) : null}
                    </CardSubtitle>
                    <CardText>
                      <span className="font-weight-bold">sold:</span>{" "}
                      <span className="mr-3">{item.sold} items</span>
                    </CardText>
                    <div
                      ref={(ref) => {
                        refArray.current[item._id] = ref;
                      }}
                      onClick={changeColor.bind(null, item._id)}
                    >
                      <Button
                        className="fa fa-shopping-cart ml-2"
                        color="success"
                        size="sm"
                        onClick={() => onAddToCart(item._id)}
                      >
                        <span className="ml-1">add to cart</span>
                      </Button>
                    </div>
                    <div
                      className="d-none"
                      ref={(ref) => {
                        rArray.current[item._id] = ref;
                      }}
                      onClick={changeColor.bind(null, item._id)}
                    >
                      <Button
                        className="fa fa-trash ml-2"
                        color="danger"
                        size="sm"
                        onClick={() => onDeleteClick(item._id)}
                      >
                        <span className="ml-1">remove from cart</span>
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </CardGroup>
          {PostSize >= Limit ? (
            <div className="text-center mt-3">
              <Button
                size="lg"
                outline
                color="secondary"
                block
                onClick={onLoadMore}
              >
                Load More
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default LandingPage;
