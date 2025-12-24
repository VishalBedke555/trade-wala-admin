import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './orders.css';
import ReactPaginate from 'react-paginate';
import Loader from '../components/loader/Loader';
import Drawer from '../components/drawer/Drawer';
import { fetchOrdersThunk } from '../store/ordersSlice';
import OrdersComp from '../components/orders/OrdersComp';

const Orders = ({ type }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const queryTypeRef = useRef('');

    const [limits, setLimits] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedDate, setSelectedDate] = useState("");

    const getOrders = () => {
        const isoDate = selectedDate ? new Date(selectedDate).toISOString() : "";
        dispatch(fetchOrdersThunk({
            currentPage,
            limit: limits,
            type,
            dealerId: '',
            search: queryTypeRef.current.value,
            date: isoDate,
            userId: ''
        }));
    }

    useEffect(() => {
        getOrders()
    }, [dispatch, currentPage, limits, navigate, type, selectedDate]);

    useEffect(() => {
        setCurrentPage(1);
    }, [location.pathname]);

    const { error, isLoading, data, pageCount } = useSelector((state) => state.orders);

    return (
        <Drawer>
            <div className="listMain">
                <h2>{type.charAt(0).toUpperCase() + type.slice(1)} Orders</h2>
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
                    <div style={{ display: 'flex', gap: '4px' }}>
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
                        <div className="search-tab-flex">
                            {/* <span style={{ paddingRight: '6px' }}>Search </span> */}
                            <input type="text" placeholder='Search' ref={queryTypeRef} onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    getOrders();
                                    setCurrentPage(1)
                                }
                            }} />
                            <button onClick={() => {getOrders();setCurrentPage(1)}} className="bi bi-search"></button>
                        </div>
                    </div>
                </div>
                {isLoading && <Loader />}

                <OrdersComp data={data} />

                {error && <div className='errDiv'><p>{error}</p></div>}
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
}

export default Orders;