import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import '../orders.css';
import Drawer from "../../components/drawer/Drawer";
import Loader from "../../components/loader/Loader";
import defaulImg from "../../assets/gallery_default.png";
import { deleteCategoryThunk, fetchCategoryThunk, updateCategoryListingThunk } from "../../store/categorySlice";
import Modal from "../../components/modal/Modal";
import UpdateCategory from "./AddCategory";

const Categories = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const queryTypeRef = useRef('');

    const [limits, setLimits] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [updatePopup, setUpdatePopup] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const getCategories = () => {
        dispatch(fetchCategoryThunk({ currentPage, limit: limits, search: queryTypeRef.current.value }));
    }

    useEffect(() => {
        getCategories()
    }, [dispatch, currentPage, limits,]);

    useEffect(() => {
        setCurrentPage(1);
    }, [location.pathname]);

    const handleDeleteCategory = (categoryId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this Category?");
        if (isConfirmed) {
            dispatch(deleteCategoryThunk({
                categoryType: "category",
                docId: categoryId
            }))
        }
    }

    const handleUpdate = (categoryId) => {
        const isConfirmed = window.confirm("Are you sure you want to update this Category?");
        if (isConfirmed) {
            dispatch(updateCategoryListingThunk({ categoryId }));
        }
    };

    const { error, isLoading, data } = useSelector((state) => state.category);

    return (
        <Drawer>
            <div className="listMain">
                <h2>Categories</h2>
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
                        <button onClick={() => setUpdatePopup(true)}>Add Category</button>
                        <input type="text" ref={queryTypeRef} placeholder="Search" onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                getCategories();
                                setCurrentPage(1);
                            }
                        }} />
                        <button onClick={() => {getCategories(); setCurrentPage(1);}} className="bi bi-search"></button>
                    </div>
                </div>
                {isLoading && <Loader />}

                {data && (
                    <div style={{ overflowX: 'scroll' }}>
                        <table className="questionsTable" frame="void" rules="none">
                            <thead>
                                <tr>
                                    <th>Sr.No.</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Count</th>
                                    <th>Created At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.categories?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center' }}>No Records Found...</td>
                                    </tr>
                                ) : (
                                    data?.categories?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <span style={{ color: "green", fontWeight: "bold", fontSize: "12px" }}>{item?.topListed ? "Listed" : ""}</span><br />
                                                <img
                                                    src={item?.image || defaulImg}
                                                    alt={item?.name}
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        objectFit: "cover",
                                                        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                                                    }}
                                                    onClick={() => setImagePreview(item?.image)}
                                                />
                                            </td>
                                            <td>
                                                <Link to={`/subCategory?categoryId=${item?._id}`}>{item?.name || 'N/A'}</Link>
                                            </td>
                                            <td>{item?.count || 0}</td>
                                            <td>
                                                {new Date(item?.createdAt).toLocaleString() || 'N/A'} <br /> <br />
                                            </td>
                                            <td>
                                                <button
                                                    className="actionButton"
                                                    style={{ backgroundColor: item?.topListed ? "green" : "" }}
                                                    onClick={() => handleUpdate(item._id)}>
                                                    <span className={item?.topListed ? "bi bi-clipboard-check-fill" : "bi bi-clipboard-check"}></span>
                                                </button>
                                                <button className="actionButton" onClick={() => setUpdatePopup(item)}>
                                                    <span className="bi bi-pencil"></span>
                                                </button>
                                                <button className="actionButton" style={{ backgroundColor: 'var(--danger)' }} onClick={() => handleDeleteCategory(item._id)}>
                                                    <span className="bi bi-trash"></span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {
                            updatePopup && (
                                <Modal isOpen onClose={() => setUpdatePopup(null)}>
                                    <UpdateCategory
                                        categoryData={updatePopup}
                                        onClose={() => setUpdatePopup(null)}
                                        onUpdateSuccess={() => setUpdatePopup(null)}  // Auto-close on success
                                    />
                                </Modal>
                            )
                        }
                        {imagePreview && <Modal isOpen onClose={() => setImagePreview(null)}>
                            <div style={{ textAlign: 'center' }}>
                                <img src={imagePreview} width={300} height={300} style={{ objectFit: 'contain' }} />
                            </div>
                        </Modal>}
                    </div>
                )}
                {error && <div className='errDiv'><p>{error}</p></div>}
            </div>
            <ReactPaginate
                breakLabel="..."
                forcePage={currentPage - 1}
                activePage={3}
                className={`pagination margin-16 ${data?.page <= 1 ? 'disabled' : ''}`}
                nextLabel="Next"
                activeClassName="active"
                nextClassName="active"
                previousLinkClassName="unactive"
                breakClassName="unactive"
                onPageChange={data?.page > 1 ? (x) => {
                    const mPage = x.selected + 1;
                    setCurrentPage(mPage);
                } : null}
                pageRangeDisplayed={3}
                pageCount={data?.page || 0}
                previousLabel="Previous"
                disabledClassName="disabled"
            />
        </Drawer>
    )
}

export default Categories;