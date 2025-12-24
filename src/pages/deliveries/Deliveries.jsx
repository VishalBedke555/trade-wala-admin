import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import Drawer from "../../components/drawer/Drawer";
import Loader from "../../components/loader/Loader";
import "../orders.css";
import "./Deliveries.css";
import defaulImg from "../../assets/gallery_default.png";
import { fetchDeliveriesThunk } from "../../store/deliveriesSlice";

const Deliveries = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");
    const type = params.get("type");

    const [limits, setLimits] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const { error, isLoading, data, pageCount } = useSelector((state) => state.deliveries);

    const getDeliveries = () => {
        dispatch(fetchDeliveriesThunk({ orderId: orderId || "", type: type || "returned", currentPage, limit: limits }));
    }

    useEffect(() => {
        getDeliveries()
    }, [dispatch, currentPage, limits]);

    useEffect(() => {
        setCurrentPage(1);
        data?.length === 0 && setCurrentPage(1);
    }, [location.pathname]);

    return (
        <Drawer>
            <div className="listMain">
                <h2>{type == "all" ? "All Deliveries" : "Returned Deliveries"}</h2>
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
                    <div className="deliveryTableWrapper">
                        <table className="questionsTable">
                            <thead>
                                <tr>
                                    <th>Sr.No.</th>
                                    <th>Product</th>
                                    <th>Dispatch Count</th>
                                    <th>Toll Details</th>
                                    <th>Amount</th>
                                    <th>Delivery Status</th>
                                    <th>Delivery Status Logs</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center' }}>No Records Found...</td>
                                    </tr>
                                ) : (
                                    data?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {item?.orderDetails.map((product, idx) => (
                                                    <div key={idx}>
                                                        <strong>{product.productName}</strong>
                                                        <p>{product._id}</p>
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {item?.orderDetails.map((product, idx) => (
                                                    <div key={idx}>
                                                        <p>{product.dispatchCount}</p>
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {item?.fastagTolls != '' ? item?.fastagTolls.map((toll, idx) => (
                                                    <div key={idx} className="toll-details">
                                                        <img src={toll?.image || defaulImg} onError={(e) => e.target.src = defaulImg} alt={toll?.tollName} />
                                                        <p>{toll.tollName}</p>
                                                        <p>₹ {toll.amount}</p>
                                                    </div>
                                                )) : 'N/a'}
                                            </td>
                                            <td>₹ {item?.amount}</td>
                                            <td>{item?.deliveryStatus}</td>
                                            <td>
                                                <div className="timeline">
                                                    {item?.deliveryStatusLogs.map((log, idx) => (
                                                        <div key={idx} className="timeline-item">
                                                            <div className="timeline-dot">✓</div>
                                                            <span className="timeline-text">{log}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {error && <div className='errDiv'><p>{error}</p></div>}

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
            </div>
        </Drawer>
    );
};

export default Deliveries;
