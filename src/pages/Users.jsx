import { Link, useLocation, useNavigate } from "react-router-dom";
import Drawer from "../components/drawer/Drawer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import Loader from "../components/loader/Loader";
import { deleteUserThunk, fetchUsersThunk, updateUserBlockingThunk } from "../store/usersSlice";
import "./orders.css";

const Users = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [limits, setLimits] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const queryTypeRef = useRef('');

    // Fetch users on mount & when dependencies change
    const getUsers = () => {
        dispatch(fetchUsersThunk({ currentPage, limit: limits, search: queryTypeRef.current.value }));
    }
    useEffect(() => {
        getUsers()
    }, [dispatch, currentPage, limits]);

    // Reset to first page on route change
    useEffect(() => {
        setCurrentPage(1);
    }, [location.pathname]);

    const { error, isLoading, data, pageCount } = useSelector((state) => state.users);

    // Handle blocking/unblocking a user
    const handleBlockUser = (userId, isBlocked) => {
        const isConfirmed = window.confirm(`Are you sure you want to ${isBlocked ? "unblock" : "block"} this user?`);
        if (isConfirmed) {
            dispatch(updateUserBlockingThunk({ userId }));
        }
    };

    const handleDeletClick = (userId)=>{
        const isConfirm = window.confirm("Are you sure you want to delete user");
        if(isConfirm){
            dispatch(deleteUserThunk({userId}))
        }
    }

    return (
        <Drawer>
            <div className="listMain">
                <h2>Users</h2>
                {/* Limit Selection Dropdown */}
                <div className="searchTab">
                    <div>
                        <span>Limits </span>
                        <select
                            value={limits}
                            onChange={(e) => {
                                setCurrentPage(1);
                                setLimits(Number(e.target.value));
                            }}
                        >
                            {[10, 25, 50, 100].map((limit) => (
                                <option key={limit} value={limit}>
                                    {limit}
                                </option>
                            ))}
                        </select>
                        <span> Entries</span>
                    </div>
                    <div className="search-tab-flex">
                        <input type="text" ref={queryTypeRef} placeholder="Search" onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                getUsers();
                                setCurrentPage(1);
                            }
                        }} />
                        <button onClick={() => {getUsers();setCurrentPage(1);}} className="bi bi-search"></button>
                    </div>
                </div>

                {/* Loading Indicator */}
                {isLoading && <Loader />}

                {/* User Data Table */}
                {data && (
                    <div style={{ overflowX: "auto" }}>
                        <table className="questionsTable" frame="void" rules="none">
                            <thead>
                                <tr>
                                    <th>Sr.No.</th>
                                    <th>User Details</th>
                                    <th>Device Id</th>
                                    <th>Version</th>
                                    <th>Source</th>
                                    <th>Location</th>
                                    <th>Created At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} style={{ textAlign: "center" }}>
                                            No Records Found...
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((item, index) => (
                                        <tr key={index} style={{ opacity: item?.blocked ? 0.5 : 1 }}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <p>
                                                    <b>Name:</b> <Link to={`/userDetails?userId=${item._id}`}>{item?.name || "N/A"}</Link>
                                                </p>
                                                <p>
                                                    <b>Email:</b> {item?.email || "N/A"}
                                                </p>
                                                <p>
                                                    <b>Mobile:</b> {item?.mobile || "N/A"}
                                                </p>
                                            </td>
                                            <td>{item?.deviceId || "N/A"}</td>
                                            <td>{item?.version || "N/A"}</td>
                                            <td>{item?.source || "N/A"}</td>
                                            <td>
                                                <details>
                                                    <summary>Location</summary>
                                                    <p>
                                                        <b>Address Type:</b> {item?.defaultLocation?.addressType || "N/A"}
                                                    </p>
                                                    <p>
                                                        <b>Address:</b> {item?.defaultLocation?.address1 || "N/A"}
                                                    </p>
                                                    <p>
                                                        <b>City:</b> {item?.defaultLocation?.city || "N/A"}
                                                    </p>
                                                    <p>
                                                        <b>State:</b> {item?.defaultLocation?.state || "N/A"}
                                                    </p>
                                                    <p>
                                                        <b>Pin Code:</b> {item?.defaultLocation?.pinCode || "N/A"}
                                                    </p>
                                                </details>
                                            </td>
                                            <td>{new Date(item?.createdAt).toLocaleString() || "N/A"}</td>
                                            <td>
                                                <button
                                                    className="actionButton"
                                                    onClick={() => navigate(`/userOrders?userId=${item?._id}`)}
                                                >
                                                    <span className="bi bi-eye"></span>
                                                </button>
                                                <button
                                                    className="actionButton"
                                                    style={{ backgroundColor: "var(--danger)", marginLeft: "2px" }}
                                                    onClick={() => handleBlockUser(item?._id, item?.blocked)}
                                                >
                                                    <span className="bi bi-ban"></span>
                                                </button>
                                                <button
                                                    className="actionButton" style={{backgroundColor:"var(--danger)"}}
                                                    onClick={() => handleDeletClick(item?._id)}
                                                >
                                                    <span className="bi bi-trash"></span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Error Handling */}
                {error && (
                    <div className="errDiv">
                        <p>{error}</p>
                    </div>
                )}
            </div>

            {/* Pagination Component */}
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

export default Users;
