import React, { useEffect, useState } from "react";
import "./statistics.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatsThunk } from "../../store/StatsSlice";
import Drawer from "../../components/drawer/Drawer";
import Loader from "../../components/loader/Loader";

const Statistics = () => {
    const dispatch = useDispatch();
    const [date, setDate] = useState("");

    const formatDate = (date) => {
        return date ? new Date(date).toISOString() : "";
    };

    useEffect(() => {
        dispatch(fetchStatsThunk({ date }));
    }, [dispatch, date]);

    const { error, isLoading, data } = useSelector((state) => state.stats);
    const { totalDealers = 0, totalUsers = 0, ordersData = {} } = data || {};

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        const formattedDate = formatDate(selectedDate);
        setDate(formattedDate);
    };

    const clearDate = () => {
        setDate("");
    };

    return (
        <Drawer>
            <div className="listMain">
                <div className="statistics-container">
                    <h2 className="statistics-title">Statistics Overview</h2>

                    {/* Date Input with Clear Button */}
                    <div className="date-picker">
                        <label htmlFor="date">Select Date:</label>
                        <input
                            type="date"
                            id="date"
                            value={date ? date.split("T")[0] : ""}
                            onChange={handleDateChange}
                            className="date-input"
                        />
                        {date && (
                            <button onClick={clearDate} className="clear-btn">
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Statistics Grid */}
                    <div className="statistics-grid">
                        <div className="statistics-card">
                            <h3>Total Dealers</h3>
                            <p className="statistics-value">{totalDealers}</p>
                        </div>
                        <div className="statistics-card">
                            <h3>Total Users</h3>
                            <p className="statistics-value">{totalUsers}</p>
                        </div>
                    </div>

                    <div className="statistics-card orders-card">
                        <h3>Orders Summary</h3>
                        <div className="orders-details">
                            <div className="order-summary-box large-box">
                                <p>
                                    <span>Total Orders:</span> {ordersData.totalOrders || 0}
                                </p>
                                <p>
                                    <span>Total Order Value:</span> ₹{ordersData.totalOrderValue || 0}
                                </p>
                            </div>
                            <div className="order-summary-box small-box">
                                <p>
                                    <span>On Request Orders:</span> {ordersData.onRequestOrders || 0}
                                </p>
                            </div>
                            <div className="order-summary-box small-box">
                                <p>
                                    <span>Ongoing Orders:</span> {ordersData.onGoingOrders || 0}
                                </p>
                            </div>
                            <div className="order-summary-box small-box">
                                <p>
                                    <span>Completed Orders:</span> {ordersData.completedOrders || 0}
                                </p>
                            </div>
                            <div className="order-summary-box small-box">
                                <p>
                                    <span>Rejected Orders:</span> {ordersData.rejectedOrders || 0}
                                </p>
                            </div>
                            <div className="order-summary-box small-box">
                                <p>
                                    <span>Returned Orders:</span> {ordersData.orderReturns || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <Loader />}
            {error && <div className="errDiv"><p>{error}</p></div>}
        </Drawer>
    );
};

export default Statistics;
