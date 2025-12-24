import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { fetchOrderDetailsThunk } from "../store/ordersSlice";
import Drawer from "../components/drawer/Drawer";
import "./orders.css"; // Add custom CSS for styling
import Loader from "../components/loader/Loader";

const OrderDetails = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderDetailsThunk({ orderId }));
        }
    }, [dispatch, orderId]);

    const { error, isLoading, orderDetails } = useSelector((state) => state.orders);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Drawer>
            <div className="listMain">
                <div className="orderDetailsContainer">
                    <h2 className="pageTitle">Order Details</h2>

                    {/* Order Summary */}
                    <section className="orderSummary">
                        <h3>Order Summary</h3>
                        <p><strong>Order Number:</strong> #{orderDetails?.orderNumber}</p>
                        <p><strong>Order Status:</strong> {orderDetails?.orderStatus}</p>
                        <p><strong>Created At:</strong> {new Date(orderDetails?.createdAt).toLocaleDateString()}</p>
                        <p><strong>Total:</strong> ₹{orderDetails?.total}</p>
                    </section>

                    {/* User Details */}
                    <section className="userDetails">
                        <h3>User Details</h3>
                        <p><strong>Name:</strong> {orderDetails?.userDetails?.name}</p>
                        <p><strong>Email:</strong> {orderDetails?.userDetails?.email}</p>
                        <p><strong>Mobile:</strong> {orderDetails?.userDetails?.mobile}</p>
                        <p>
                            <strong>Default Location:</strong> {orderDetails?.userDetails?.defaultLocation?.address1},{" "}
                            {orderDetails?.userDetails?.defaultLocation?.city}, {orderDetails?.userDetails?.defaultLocation?.state}
                        </p>
                    </section>

                    {/* Dealer Details */}
                    <section className="dealerDetails">
                        <h3>Dealer Details</h3>
                        <p><strong>Company Name:</strong> {orderDetails?.dealerDetails?.companyName}</p>
                        <p><strong>Name:</strong> {orderDetails?.dealerDetails?.name}</p>
                        <p><strong>Email:</strong> {orderDetails?.dealerDetails?.email}</p>
                        <p>
                            <strong>Location:</strong> {orderDetails?.dealerDetails?.location?.address1},{" "}
                            {orderDetails?.dealerDetails?.location?.city}, {orderDetails?.dealerDetails?.location?.state}
                        </p>
                    </section>

                    {/* Order Items */}
                    <section className="orderItems">
                        <h3>Order Items</h3>
                        {orderDetails?.orderDetails?.length > 0 ? (
                            orderDetails?.orderDetails.map((item) => (
                                <div className="itemCard" key={item._id}>
                                    <img src={item.image} alt={item.name} className="itemImage" />
                                    <div className="itemDetails">
                                        <p><strong>Product:</strong> {item.name}</p>
                                        <p><strong>Price:</strong> ₹{item.price}</p>
                                        <p><strong>Quantity:</strong> {item.quantity}</p>
                                        <p><strong>Discount:</strong> ₹{item.discount}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No items found in this order.</p>
                        )}
                    </section>

                    {/* Payment Summary */}
                    <section className="paymentSummary">
                        <h3>Payment Summary</h3>
                        <p><strong>Items Total:</strong> ₹{orderDetails?.itemsTotal}</p>
                        <p><strong>Discount:</strong> ₹{orderDetails?.discount}</p>
                        <p><strong>Delivery Fee:</strong> ₹{orderDetails?.deliveryFee}</p>
                        <p><strong>Grand Total:</strong> ₹{orderDetails?.total}</p>
                    </section>

                    {/* Receipts */}
                    <section className="receipts">
                        <h3>Receipts</h3>
                        {orderDetails?.receipts?.length > 0 ? (
                            orderDetails.receipts.map((receipt, index) => (
                                <div key={index} className="receiptCard">
                                    <img src={receipt.image} alt={receipt.name} width="300px" height={400} className="receiptImage" />
                                    <p><strong>Name:</strong> {receipt.name}</p>
                                    <p><strong>Created At:</strong> {new Date(receipt.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <p>No receipts found.</p>
                        )}
                    </section>

                    {/* Payments */}
                    <section className="payments">
                        <h3>Payments</h3>
                        {orderDetails?.payments?.length > 0 ? (
                            orderDetails.payments.map((payment, index) => (
                                <p key={index}>
                                    <strong>{payment.paymentName}</strong>: ₹{payment.amount} on{" "}
                                    {new Date(payment.createdAt).toLocaleDateString()}
                                </p>
                            ))
                        ) : (
                            <p>No payments found.</p>
                        )}

                        <div className="details-link">
                            <Link to={`/payments?orderId=${orderId}`}>View Payments</Link>
                        </div>
                    </section>

                    {/* Delivery Details */}
                    <section className="deliveryDetails">
                        <h3>Delivery Details</h3>
                        {orderDetails?.deliveryDetails?.length > 0 ? (
                            orderDetails.deliveryDetails.map((delivery, index) => (
                                <div key={index} className="deliveryCard">
                                    <h4>Delivery #{index + 1}</h4>
                                    <div className="deliveryItems">
                                        {delivery.orderDetails.map((product, idx) => (
                                            <p key={idx}>
                                                <strong>{product.productName}</strong>: {product.dispatchCount} units
                                            </p>
                                        ))}
                                    </div>
                                    <div className="deliveryImages">
                                        <p><strong>Truck Loading Pictures:</strong></p>
                                        {delivery.truckLoadingPictures.map((img, idx) => (
                                            <img key={idx} src={img} alt="Truck Loading" width="300px" height={400} className="deliveryImage" />
                                        ))}
                                    </div>
                                    <p><strong>Transport Copy:</strong> <a href={delivery.transportCopy} target="_blank" rel="noopener noreferrer">View</a></p>
                                    <p><strong>Created At:</strong> {new Date(delivery.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <p>No delivery details found.</p>
                        )}
                        <div className="details-link">
                            <Link to={`/returnedDeliveries?orderId=${orderId}&type=all`}>View Deliveries</Link>
                        </div>
                        
                    </section>
                </div>
            </div>
        </Drawer>
    );
};

export default OrderDetails;