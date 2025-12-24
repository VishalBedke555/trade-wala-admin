import React, { useEffect, useState } from "react";
import "../statistics/statistics.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDealerStatsThunk } from "../../store/approvalsSlice";

const DealersStatistics = ({dealerId}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const formatDate = (date) => {
        return new Date(date).toISOString();
    };

    const [date, setDate] = useState("");

    const { error, isLoading, stats } = useSelector((state) => state.approvals);

    useEffect(() => {
        // Dispatch initial fetch with default date
        dispatch(fetchDealerStatsThunk({ date, dealerId, userId: "" }));
    }, [dispatch, date]);

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        // Format the selected date with time
        const formattedDate = formatDate(new Date(selectedDate));
        setDate(formattedDate);
    };
    
    const clearDate = () => {
        setDate("");
    };

    return (
        <>
            <div style={{marginTop:'20px'}}>
                <div className="statistics-container">
                    <h2 className="statistics-title">Dealers Statistics Overview</h2>

                    {/* Date Input */}
                    <div className="date-picker">
                        <label htmlFor="date">Select Date:</label>
                        <input
                            type="date"
                            id="date"
                            value={date.split("T")[0]} // Show only the date part in the input
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
                            <h3>Total Orders</h3>
                            <p className="statistics-value">{stats?.totalOrders || 0}</p>
                        </div>
                        <div className="statistics-card">
                            <h3>Completed Orders</h3>
                            <p className="statistics-value">{stats?.completedOrders || 0}</p>
                        </div>
                        
                    </div>
                    <div className="statistics-card orders-card">
                            <h3>Orders Summary</h3>
                            <div className="orders-details">
                                <div className="order-summary-box large-box">
                                    <p>
                                        <span>Total Order Amount:</span> ₹{stats?.totalOrderAmount || 0}
                                    </p>
                                </div>
                                <div className="order-summary-box small-box">
                                    <p>
                                        <span>On Request Orders:</span> {stats?.onRequestOrders || 0}
                                    </p>
                                </div>
                                <div className="order-summary-box small-box">
                                    <p>
                                        <span>Ongoing Orders:</span> {stats?.onGoingOrders || 0}
                                    </p>
                                </div>
                                <div className="order-summary-box small-box">
                                    <p>
                                        <span>Completed Orders:</span> {stats?.completedOrders || 0}
                                    </p>
                                </div>
                                <div className="order-summary-box small-box">
                                    <p>
                                        <span>Rejected Orders:</span> {stats?.rejectedOrders || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </>
    );
};

export default DealersStatistics;
