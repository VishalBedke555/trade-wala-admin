import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../pages/orders.css';

const OrdersComp = ({ data }) => {
    const navigate = useNavigate();

    return (
        <>
            {data && (
                <div style={{ overflowX: 'scroll' }}>
                    <table className="questionsTable" frame="void" rules="none">
                        <thead>
                            <tr>
                                <th>Sr.No.</th>
                                {/* <th>Order Number</th> */}
                                {/* <th>Order Status</th> */}
                                <th>User Details</th>
                                <th>Dealer Details</th>
                                <th>Order Details</th>
                                <th>Financial Details</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.length === 0 ? (
                                <tr>
                                    <td colSpan={10} style={{ textAlign: 'center' }}>No Records Found...</td>
                                </tr>
                            ) : (
                                data?.map((item, index) => (
                                    <tr key={index}>
                                        {/* General Order Information */}
                                        <td>{index + 1}</td>
                                        {/* <td>{item?.orderNumber || 'N/A'}</td> */}
                                        {/* <td>{item?.orderStatus || 'N/A'}</td> */}

                                        {/* User Details */}
                                        <td>
                                            <p><b>Name:</b> {item?.userDetails?.name || 'N/A'}</p>
                                            <p><b>Email:</b> {item?.userDetails?.email || 'N/A'}</p>
                                            <p><b>Mobile:</b> {item?.userDetails?.mobile || 'N/A'}</p>
                                            {/* <details>
                                                    <summary>Location</summary>
                                                    <p><b>Address Type:</b> {item?.userDetails?.defaultLocation?.addressType || 'N/A'}</p>
                                                    <p><b>Address:</b> {item?.userDetails?.defaultLocation?.address1 || 'N/A'}</p>
                                                    <p><b>City:</b> {item?.userDetails?.defaultLocation?.city || 'N/A'}</p>
                                                    <p><b>State:</b> {item?.userDetails?.defaultLocation?.state || 'N/A'}</p>
                                                    <p><b>Pin Code:</b> {item?.userDetails?.defaultLocation?.pinCode || 'N/A'}</p>
                                                </details> */}
                                        </td>
                                        {/* Dealer Details */}
                                        <td>
                                            <p><b>Name:</b> {item?.dealerDetails?.name || 'N/A'}</p>
                                            <p><b>Company Name:</b> {item?.dealerDetails?.companyName || 'N/A'}</p>
                                            <p><b>Email:</b> {item?.dealerDetails?.email || 'N/A'}</p>
                                            <p><b>Mobile:</b> {item?.dealerDetails?.mobile || 'N/A'}</p>
                                        </td>
                                        {/* Order Details */}
                                        <td>
                                            {item?.orderDetails?.map((order, orderIndex) => (
                                                <div key={orderIndex} style={{ marginBottom: '10px', width: '140px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                                                    <p>
                                                        {order?.name || 'N/A'} x {order?.quantity}
                                                        <span style={{ float: 'right' }}>
                                                            ₹{(parseInt(order?.price) - parseInt(order?.discount)) * parseInt(order?.count)}
                                                        </span>
                                                    </p>
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            <p><b>Items Total:</b> ₹{item?.itemsTotal || 'N/A'}</p>
                                            <p><b>Discount:</b> ₹{item?.discount}</p>
                                            <p><b>Delivery Fee:</b> ₹{item?.deliveryFee || 'N/A'}</p>
                                            <p><b>Total:</b> ₹{item?.total || 'N/A'}</p>
                                        </td>
                                        <td>
                                            {new Date(item?.createdAt).toLocaleString() || 'N/A'} <br /> <br />
                                            <Link to={`/orderDetails?orderId=${item?._id}`} >View Order Details</Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default OrdersComp;