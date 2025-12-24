import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Drawer from "../../components/drawer/Drawer";
import Loader from "../../components/loader/Loader";
import { deleteCouponThunk, fetchCouponsThunk } from "../../store/couponsSlice";
import "../orders.css"

const Coupons = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [limits, setLimits] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const { error, isLoading, data, pageCount } = useSelector((state) => state.coupons);

    useEffect(() => {
        dispatch(fetchCouponsThunk({ currentPage, limit: limits }));
    }, [dispatch, currentPage, limits,]);

    useEffect(() => {
        setCurrentPage(1);
        data?.length === 0 && setCurrentPage(1)
    }, [location.pathname]);

    const handleDeleteCoupon = (couponId) => {
        const isConfirm = window.confirm("Are you sure, you want to delete coupon?")
        if (isConfirm) {
            dispatch(deleteCouponThunk({ couponId }))
        }
    }


    return (
        <Drawer>
            <div className="listMain">
                <h2>Coupons</h2>
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
                    <div>
                        <button onClick={() => navigate('/createCoupon')}>Create Coupon</button>
                    </div>

                </div>
                {isLoading && <Loader />}

                {data && (
                    <div style={{ overflowX: 'scroll' }}>
                        <table className="questionsTable" frame="void" rules="none">
                            <thead>
                                <tr>
                                    <th>Sr.No.</th>
                                    <th>Code</th>
                                    <th>Created By</th>
                                    <th>Discount</th>
                                    <th>Minimum Order Value</th>
                                    <th>Expiry Date</th>
                                    <th>Created At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} style={{ textAlign: 'center' }}>No Records Found...</td>
                                    </tr>
                                ) : (
                                    data?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item?.code || 'N/A'}</td>
                                            <td>{item?.createdBy || 'N/A'}</td>
                                            <td>₹ {item?.discount || 0}</td>
                                            <td>₹{item?.orderValue || 0}</td>
                                            <td>{new Date(item?.expiryDate).toLocaleString() || 'N/A'}</td>
                                            <td>
                                                {new Date(item?.createdAt).toLocaleString() || 'N/A'}
                                            </td>
                                            <td>
                                                <button className="actionButton" style={{ backgroundColor: 'var(--danger)' }} onClick={() => handleDeleteCoupon(item?._id)}>
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
    )
}

export default Coupons;