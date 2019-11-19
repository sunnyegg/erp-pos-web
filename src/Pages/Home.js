import React, { useState, useEffect } from "react";
import Axios from "axios";
import storage from "local-storage";
import Rupiah from "rupiah-format";
import { Redirect, Link } from "react-router-dom";

import CartIcon from "../Assets/Icon/cart.svg";

import {
  Alert,
  ButtonDropdown,
  Button,
  Badge,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Card,
  CardTitle,
  CardText,
  Row,
  Col,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label
} from "reactstrap";

const HomePage = props => {
  const [Data, setData] = useState([]);
  const [Cart, setCart] = useState([]);
  const [CustomerName, setCustomerName] = useState("");
  const [CustomerTable, setCustomerTable] = useState("");
  const [Search, setSearch] = useState("");

  const [Loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setOpen] = useState(false);
  const [ModalCustomer, setModalCustomer] = useState(false);
  const [LogOut, setLogOut] = useState(false);

  const toggleNav = () => setIsOpen(!isOpen);
  const toggleProfile = () => setOpen(!dropdownOpen);
  const toggleModalCust = () => setModalCustomer(!ModalCustomer);

  const getData = () => {
    setLoading(true);
    new Promise((resolve, reject) => {
      Axios.get(`${process.env.REACT_APP_API_URL}/api/menu?search=${Search}`, {
        headers: {
          Authorization: `Bearer ${storage.get("user-token")}`
        }
      })
        .then(menu => {
          setTimeout(setLoading(false), 5000);
          resolve(setData(menu.data.data));
        })
        .catch(err => {
          setData([]);
          setLoading(false);
          reject(err);
        });
    });
  };

  const addToCart = data => {
    const { menu_id, menu_name, menu_price, menu_category } = data;
    const order = {
      customer_name: storage.get("customer-name"),
      order_table: storage.get("customer-table"),
      menu_id,
      menu_name,
      menu_price,
      menu_category,
      order_quantity: 1
    };

    setCart([...Cart, order]);
    console.log(Cart);
  };

  const registerCustomer = data => {
    setLoading(true);
    if (!data.customer_name & !data.order_table) {
      window.alert("Data cannot be empty!");
      setLoading(false);
    } else {
      storage.set("customer-name", data.customer_name);
      storage.set("customer-table", data.order_table);
      toggleModalCust();
      setLoading(false);
    }
  };

  const logOut = () => {
    new Promise((resolve, reject) => {
      Axios.post(`${process.env.REACT_APP_API_URL}/api/user/logout/${storage.get("user-id")}`)
        .then(() => {
          storage.clear();
          resolve(setLogOut(true));
        })
        .catch(err => {
          reject(err);
          console.log(err);
        });
    });
  };

  useEffect(() => {
    getData();
  }, [Search]);

  return (
    <div style={{ flex: 1 }}>
      <div>
        <Navbar style={{ backgroundColor: "#0fbcf9" }} light expand="md">
          <NavbarBrand style={{ color: "white" }}>ERP POS</NavbarBrand>
          <NavbarToggler onClick={toggleNav} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {/* <NavItem>
                <Link to="/order">Orders</Link>
              </NavItem> */}
              <NavItem style={{ marginRight: 20 }}>
                <Button onClick={() => console.log(Cart)} style={{ backgroundColor: "#0fbcf9" }}>
                  <img src={CartIcon} />
                  <Badge style={{ marginLeft: 5 }} color="success">
                    {Cart.length}
                  </Badge>
                </Button>
              </NavItem>
              <NavItem style={{ marginRight: 20 }}>
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggleProfile}>
                  <DropdownToggle color="info" caret>
                    {storage.get("user-name")} (
                    {storage.get("user-type") === 1
                      ? "Kasir"
                      : !storage.get("user-type")
                      ? "Anonymous"
                      : "Pelayan"}
                    )
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => logOut()}>Logout</DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>

      <div>
        {storage.get("logged-in") ? "" : <Alert color="danger">You are not logged in!</Alert>}
        {LogOut ? <Redirect to="/" /> : ""}
      </div>

      <Row style={{ margin: 15 }}>
        <Col sm="6">
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Search</InputGroupText>
            </InputGroupAddon>
            <Input value={Search} onChange={event => setSearch(event.target.value)} />
          </InputGroup>
        </Col>
        <Col sm="6">{Loading ? <Spinner color="primary" /> : ""}</Col>
      </Row>

      <div style={{ margin: 10, padding: 10 }} className="border">
        <Row style={{ margin: 10, padding: 10 }} className="border">
          <Col>
            <label>
              Customer: <b>{storage.get("customer-name")}</b>
            </label>
            <Badge style={{ marginLeft: 5 }}>{storage.get("customer-table")}</Badge>
          </Col>
          {storage.get("customer-name") ? (
            <Button onClick={toggleModalCust} color="warning" size="sm">
              Edit Customer
            </Button>
          ) : (
            <Button onClick={toggleModalCust} color="primary" size="sm">
              Register Customer
            </Button>
          )}
          <Modal isOpen={ModalCustomer} toggle={toggleModalCust}>
            <ModalHeader toggle={toggleModalCust}>
              {storage.get("customer-name") ? "Edit Customer" : "Register Customer"}
            </ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="CustomerName">Customer Name:</Label>
                  <Input
                    id="CustomerName"
                    type="text"
                    name="customer_name"
                    value={CustomerName}
                    onChange={event => setCustomerName(event.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="CustomerTable">Customer Table:</Label>
                  <Input
                    id="CustomerTable"
                    type="number"
                    name="order_table"
                    value={CustomerTable}
                    onChange={event => setCustomerTable(event.target.value)}
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() =>
                  registerCustomer({
                    customer_name: CustomerName,
                    order_table: CustomerTable
                  })
                }
              >
                {Loading ? (
                  <Spinner style={{ color: "white" }} />
                ) : storage.get("customer-name") ? (
                  "Edit"
                ) : (
                  "Register"
                )}
              </Button>{" "}
              <Button color="secondary" onClick={toggleModalCust}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Row>
        <Row>
          {!Data.length ? (
            <div style={{ position: "relative", left: "10%" }}>
              <Alert color="danger">404 not found!</Alert>
            </div>
          ) : (
            Data.map(menu => {
              return (
                <Col key={menu.menu_id} sm="4" style={{ marginBottom: 10 }}>
                  <Card body>
                    <Row>
                      <Col sm="8">
                        <CardTitle style={{ fontSize: 24 }}>
                          <b>{menu.menu_name}</b>
                        </CardTitle>
                      </Col>
                      <Col sm="4">
                        {menu.menu_category === "Makanan" ? (
                          <Badge color="info" disabled style={{ fontSize: 14 }}>
                            {menu.menu_category}
                          </Badge>
                        ) : (
                          <Badge color="danger" disabled style={{ fontSize: 14 }}>
                            {menu.menu_category}
                          </Badge>
                        )}
                      </Col>
                    </Row>
                    <CardText>
                      Description: <i>{menu.menu_description}</i>
                    </CardText>
                    <CardText>
                      Status:{" "}
                      {menu.status === "Tersedia" ? (
                        <Badge color="primary" disabled>
                          {menu.status}
                        </Badge>
                      ) : (
                        <Badge color="danger" disabled>
                          {menu.status}
                        </Badge>
                      )}
                    </CardText>
                    <Row style={{ marginBottom: 15 }}>
                      <Col sm="6">
                        <CardText>
                          Price: <br /> {Rupiah.convert(menu.menu_price)}
                        </CardText>
                      </Col>
                      <Col sm="6">
                        <CardText>
                          Available: <br /> {menu.menu_quantity}x
                        </CardText>
                      </Col>
                    </Row>
                    {menu.status === "Tersedia" && !Cart.find(id => id.menu_id === menu.menu_id) ? (
                      <Button onClick={() => addToCart(menu)} color="success">
                        Add to Cart
                      </Button>
                    ) : (
                      <Button color="success" disabled>
                        Add to Cart
                      </Button>
                    )}
                  </Card>
                </Col>
              );
            })
          )}
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
