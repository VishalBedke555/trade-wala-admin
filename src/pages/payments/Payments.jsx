import { useDispatch, useSelector } from "react-redux";
import Drawer from "../../components/drawer/Drawer";
import { useEffect, useState } from "react";
import { fetchPaymentsThunk, settlePaymentThunk } from "../../store/paymentsSlice";
import ReactPaginate from "react-paginate";
import "../orders.css";
import "./payments.css";
import Loader from "../../components/loader/Loader";
import defaulImg from "../../assets/gallery_default.png";
import { Link, useLocation } from "react-router-dom";
import Modal from "../../components/modal/Modal";

const Payments = ({ status }) => {
    const dispatch = useDispatch();
    const location = useLocation()
    const [limits, setLimits] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [imagePreview, setImagePreview] = useState(null);
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");

    const { error, isLoading, data, pageCount } = useSelector((state) => state.payments);

    useEffect(() => {
        dispatch(fetchPaymentsThunk({ currentPage, limit: limits, status, orderId: orderId || "" }));
    }, [dispatch, currentPage, limits, status, location.pathname]);

    useEffect(() => {
        setCurrentPage(1);
        data?.length === 0 && setCurrentPage(1);
    }, [location.pathname]);

    const handleSettlePayment = async (paymentId, inStatus) => {
        if (!paymentId || !inStatus) return;

        try {
            const isConfirm = window.confirm(`Are you sure, you want to ${inStatus == "success" ? "settle" : "reject"} payment`)
            if (isConfirm) {
                // Dispatch the thunk to update the backend
                await dispatch(settlePaymentThunk({ paymentId, status: inStatus })).unwrap();

                // Manually update the Redux state after successful API call
                dispatch(fetchPaymentsThunk({ currentPage, limit: limits, status }));
            }
        } catch (err) {
            console.error("Error settling payment:", err);
        }
    };

    return (
        <Drawer>
            <div className="listMain">
                <h2>{status == "" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)} Transactions</h2>
                <div className="searchTab">
                    <div>
                        <span>Limits </span>
                        <select
                            onChange={(e) => {
                                setCurrentPage(1);
                                setLimits(Number(e.target.value));
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span> Entries</span>
                    </div>
                </div>
                {isLoading && <Loader />}

                {data && (
                    <div style={{ overflowX: "scroll" }}>
                        <table className="questionsTable" frame="void" rules="none">
                            <thead>
                                <tr>
                                    <th>Sr.No.</th>
                                    <th>Image</th>
                                    <th>Payment Name</th>
                                    <th>Details</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Created At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} style={{ textAlign: "center" }}>
                                            No Records Found...
                                        </td>
                                    </tr>
                                ) : (
                                    data?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <span
                                                    style={{
                                                        color: "green",
                                                        fontWeight: "bold",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {item?.topListed ? "Listed" : ""}
                                                </span>
                                                <br />
                                                <img
                                                    src={item?.image || defaulImg}
                                                    alt={item?.name}
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        objectFit: "cover",
                                                        boxShadow:
                                                            "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                                                    }}
                                                    onClick={() => setImagePreview(item?.image)}
                                                />
                                            </td>
                                            <td>{item?.paymentName || "N/A"}</td>
                                            <td >
                                                <div style={{ gap: "6px", display: 'flex', flexDirection: 'column' }}>
                                                    <Link to={`/orderDetails?orderId=${item?.orderId}`}>Order Details</Link>
                                                    <Link to={`/dealerSupplieProducts?dealerId=${item?.dealerId}`}>Dealer Details</Link>
                                                    <Link to={`/userDetails?userId=${item?.userId}`}>User Details</Link>
                                                </div>
                                            </td>
                                            <td>{item?.status || "N/A"}</td>
                                            <td>{item?.amount || 0}</td>
                                            <td>
                                                {new Date(item?.createdAt).toLocaleString() || "N/A"}{" "}
                                                <br /> <br />
                                            </td>
                                            <td >
                                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                    {item.status === "pending" ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleSettlePayment(item._id, "success")}
                                                                className="paymentButton"
                                                                style={{ backgroundColor: 'var(--success)' }}
                                                            >
                                                                Settle Payment
                                                            </button>
                                                            <button
                                                                onClick={() => handleSettlePayment(item._id, "reject")}
                                                                className="paymentButton"
                                                                style={{ backgroundColor: 'var(--danger)' }}
                                                            >
                                                                Reject Payment
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span style={{ color: item.status === "success" ? "var(--success)" : "var(--danger)" }}>{item.status}</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {imagePreview && <Modal isOpen onClose={() => setImagePreview(null)}>
                            <div style={{ textAlign: 'center' }}>
                                <img src={imagePreview} width={300} height={600} style={{ objectFit: 'contain' }} />
                            </div>
                        </Modal>}
                    </div>
                )}
                {error && (
                    <div className="errDiv">
                        <p>{error}</p>
                    </div>
                )}
            </div>
            <ReactPaginate
                breakLabel="..."
                forcePage={currentPage - 1}
                activePage={3}
                className={`pagination margin-16 ${pageCount <= 1 ? 'disabled' : ''}`}
                nextLabel="Next"
                activeClassName="active"
                nextClassName="active"
                previousLinkClassName="unactive"
                breakClassName="unactive"
                onPageChange={pageCount > 1 ? (x) => {
                    const mPage = x.selected + 1;
                    setCurrentPage(mPage);
                } : null}
                pageRangeDisplayed={3}
                pageCount={pageCount || 0}
                previousLabel="Previous"
                disabledClassName="disabled"
            />
        </Drawer>
    );
};

export default Payments;