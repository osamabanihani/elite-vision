import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';

export default function WishlistScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    wishlist: { wishlistItems },
  } = state;

  const moveToCartHandler = async (item) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < 1) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity: 1 } });
    ctxDispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: item });
    navigate('/cart');
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: item });
  };

  return (
    <div>
      <Helmet>
        <title>Wishlist</title>
      </Helmet>
      <h1>Wishlist</h1>
      <Row>
        <Col md={8}>
          {wishlistItems.length === 0 ? (
            <MessageBox>
              Your wishlist is empty. <Link to="/">Go shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {wishlistItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={3}>
                      <Button
                        variant="primary"
                        onClick={() => moveToCartHandler(item)}
                      >
                        Move to Cart
                      </Button>
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => removeItemHandler(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{wishlistItems.length} item(s) saved</h3>
                </ListGroup.Item>
                {wishlistItems.length > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/')}
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
