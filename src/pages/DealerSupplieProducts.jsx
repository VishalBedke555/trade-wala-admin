import React, { useEffect, useRef, useState } from "react";
import { fetchDealerDetailsThunk, fetchDealerSupplieProductsThunk } from "../store/approvalsSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import './orders.css';
import './approvals.css';
import Drawer from "../components/drawer/Drawer";
import Loader from "../components/loader/Loader";
import defaultBuilding from '../assets/building1.png';
import ReactPaginate from "react-paginate";
import { fetchOrdersThunk } from "../store/ordersSlice";
import OrdersComp from "../components/orders/OrdersComp";
import DealerProductsComp from "../components/dealer-products/DealerProductsComp";
import DealersStatistics from "./dealers/DealersStats";
import DealerDetailsCard from "./dealers/DealerDetails";

const DealerSupplieProducts = ({ listed, topListed }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const dealerId = params.get("dealerId");
    const approvalStatus = params.get("approvalStatus") === "true";
    const queryTypeRef = useRef('');
    const productQueryTypeRef = useRef('');

    const [activeTab, setActiveTab] = useState(listed ? "products" : "stats");
    const [activeOrders, setActiveOrders] = useState("onrequest");

    const [selectedDate, setSelectedDate] = useState("");

    const [limits, setLimits] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleRow, setVisibleRow] = useState(null);

    const getProducts = () => {
        const isoDate = selectedDate ? new Date(selectedDate).toISOString() : "";
        dispatch(fetchOrdersThunk({
            currentPage,
            limit: limits,
            type: activeOrders,
            dealerId,
            search: queryTypeRef.current.value,
            date: isoDate,
            userId: ''
        }))
    }

    const getDealerSupplieProducts = () => {
        console.log('hello ' + topListed)
        // Fix: Check if topListed is true first (even if listed is also true)
        const type = topListed ? "listed" : "all";
        const dealerIdParam = listed || topListed ? "" : dealerId;

        dispatch(fetchDealerSupplieProductsThunk({
            currentPage,
            limit: limits,
            dealerId: dealerIdParam,
            type: type,
            search: productQueryTypeRef.current.value
        }));
    }

    useEffect(() => {
        if (activeTab == "orders") {
            getProducts()
        }
        else if (activeTab == "products") {
            getDealerSupplieProducts()
        }
    }, [dispatch, currentPage, limits, listed, dealerId, activeOrders, activeTab, selectedDate, topListed]);

    const { dealerData, isLoading: dealerLoading } = useSelector((state) => state.approvals);

    useEffect(() => {
        if (!listed) {
            dispatch(fetchDealerDetailsThunk({ dealerId }));
        } if (listed) {
            setActiveTab("products")
        }
    }, [dealerId, dispatch, listed]);

    useEffect(() => {
        setCurrentPage(1);
    }, [location.pathname, listed]);

    const { error, isLoading, productsData, pageCount } = useSelector((state) => state.approvals);

    const toggleRowVisibility = (id) => {
        setVisibleRow((prev) => (prev === id ? null : id));
    };
    const { error: ordersError, isLoading: ordersLoading, data, pageCount: page } = useSelector((state) => state.orders);

    const handleOrdersChange = (e) => {
        setActiveOrders(e.target.value)
    }

    return (
        <Drawer>
            <div className="listMain">
                <h2>{listed ? "Listed Products" : "Dealer Supplied Products"}</h2>
                {(window.location.pathname.includes('allProducts') || window.location.pathname.includes('topListedProducts')) &&
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
                        <div className="search-tab-flex">
                            <div>
                                <input type="text" placeholder="Search" ref={productQueryTypeRef} onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        getDealerSupplieProducts();
                                        setCurrentPage(1)
                                    }
                                }} />
                                <button onClick={() => { getDealerSupplieProducts(); setCurrentPage(1) }} className="bi bi-search"></button>
                            </div>
                        </div>
                    </div>
                }
                {isLoading || ordersLoading && <Loader />}

                {!approvalStatus && !listed ? (
                    <DealerDetailsCard dealerData={dealerData} dealerId={dealerId} defaultBuilding={defaultBuilding} />
                ) : listed ?
                    (
                        <>

                            <div className="tabsButton">
                                <button
                                    className={activeTab === "products" ? "active-tab" : ""}
                                    onClick={() => setActiveTab("products")}
                                >
                                    Products
                                </button>
                            </div>

                            <div style={{ overflowX: 'scroll' }}>
                                {activeTab === "orders" ? (
                                    <div className="searchTab">
                                        <select onChange={handleOrdersChange} style={{ padding: '6px', marginTop: '15px' }}>
                                            <option value="onrequest">Request Order</option>
                                            <option value="ongoing">Ongoing Order</option>
                                            <option value="rejected">Rejected Order</option>
                                            <option value="completed">Completed Order</option>
                                        </select>
                                        <div className="search-tab-flex">
                                            <div>
                                                <input type="text" placeholder="Search" ref={queryTypeRef} onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        getProducts();
                                                        setCurrentPage(1);
                                                    }
                                                }} />
                                                <button onClick={() => { getProducts(); setCurrentPage(1); }} className="bi bi-search"></button>
                                            </div>
                                            <div>
                                                <span style={{ paddingRight: '6px' }}>Date:</span>
                                                <input
                                                    type="datetime-local"
                                                    value={selectedDate}
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                    className="datePicker"
                                                />
                                                {selectedDate && (
                                                    <button onClick={() => setSelectedDate('')} className="clear-btn">
                                                        Clear
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                {activeTab === "orders" ? (
                                    <OrdersComp data={data} />
                                ) : activeTab === "stats" && !listed ? (
                                    <DealersStatistics dealerId={dealerId} />
                                ) : (
                                    <DealerProductsComp productsData={productsData} setActiveTab={activeTab} />
                                )}
                            </div>

                            {ordersError && <div className="errDiv"><p>{ordersError}</p></div>}
                            {error && <div className="errDiv"><p>{error}</p></div>}
                        </>
                    ) : (
                        <>
                            <DealerDetailsCard dealerData={dealerData} dealerId={dealerId} defaultBuilding={defaultBuilding} />

                            <div className="tabsButton">
                                <button
                                    className={activeTab === "stats" ? "active-tab" : ""}
                                    onClick={() => setActiveTab("stats")}
                                >
                                    Statistics
                                </button>
                                <button
                                    className={activeTab === "products" ? "active-tab" : ""}
                                    onClick={() => setActiveTab("products")}
                                >
                                    Products
                                </button>
                                <button
                                    className={activeTab === "orders" ? "active-tab" : ""}
                                    onClick={() => {
                                        setActiveTab("orders");
                                        setActiveOrders("onrequest");
                                    }}
                                >
                                    Orders
                                </button>
                            </div>

                            <div style={{ overflowX: 'scroll' }}>
                                {activeTab === "orders" ? (
                                    <div className="searchTab">
                                        <select onChange={handleOrdersChange} style={{ padding: '6px', marginTop: '15px' }}>
                                            <option value="onrequest">Request Order</option>
                                            <option value="ongoing">Ongoing Order</option>
                                            <option value="rejected">Rejected Order</option>
                                            <option value="completed">Completed Order</option>
                                        </select>
                                        <div className="search-tab-flex">
                                            <div>
                                                <input type="text" placeholder="Search" ref={queryTypeRef} onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        getProducts();
                                                        setCurrentPage(1);
                                                    }
                                                }} />
                                                <button onClick={() => { getProducts(); setCurrentPage(1); }} className="bi bi-search"></button>
                                            </div>
                                            <div>
                                                <span style={{ paddingRight: '6px' }}>Date:</span>
                                                <input
                                                    type="datetime-local"
                                                    value={selectedDate}
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                    className="datePicker"
                                                />
                                                {selectedDate && (
                                                    <button onClick={() => setSelectedDate('')} className="clear-btn">
                                                        Clear
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                {activeTab === "products" ? (
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
                                        <div className="search-tab-flex">
                                            <div>
                                                <input type="text" placeholder="Search" ref={productQueryTypeRef} onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        getDealerSupplieProducts();
                                                        setCurrentPage(1);
                                                    }
                                                }} />
                                                <button onClick={() => { getDealerSupplieProducts(); setCurrentPage(1); }} className="bi bi-search"></button>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                {activeTab === "orders" ? (
                                    <OrdersComp data={data} />
                                ) : activeTab === "stats" ? (
                                    <DealersStatistics dealerId={dealerId} />
                                ) : (
                                    <DealerProductsComp productsData={productsData} setActiveTab={activeTab} />
                                )}
                            </div>

                            {ordersError && <div className="errDiv"><p>{ordersError}</p></div>}
                            {error && <div className="errDiv"><p>{error}</p></div>}
                            {isLoading && <Loader />}
                        </>
                    )}
            </div>
            {activeTab == "products" ?
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
                /> : activeTab == "orders" ?
                    <ReactPaginate
                        breakLabel="..."
                        forcePage={currentPage - 1}
                        activePage={3}
                        className={`pagination margin-16 ${page <= 1 ? 'disabled' : ''}`}
                        nextLabel="Next"
                        activeClassName="active"
                        nextClassName="active"
                        previousLinkClassName="unactive"
                        breakClassName="unactive"
                        onPageChange={page > 1 ? (x) => {
                            const mPage = x.selected + 1;
                            setCurrentPage(mPage);
                        } : null}
                        pageRangeDisplayed={3}
                        pageCount={page || 0}
                        previousLabel="Previous"
                        disabledClassName="disabled"
                    /> : ''
            }
        </Drawer>
    );
};

export default DealerSupplieProducts;