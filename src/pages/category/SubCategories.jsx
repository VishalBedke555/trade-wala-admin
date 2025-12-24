import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import '../orders.css';
import Drawer from "../../components/drawer/Drawer";
import Loader from "../../components/loader/Loader";
import { deleteCategoryThunk, fetchSubCategoryThunk } from "../../store/categorySlice";
import Modal from "../../components/modal/Modal";
import UpdateSubCategory from "./AddSubCategory";

const SubCategories = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search)
    const categoryId = params.get("categoryId")
    const queryTypeRef = useRef('');

    const [limits, setLimits] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [updatePopup, setUpdatePopup] = useState(null)
    const [imagePreview, setImagePreview] = useState(null);

    const getSubCategories = () => {
        dispatch(fetchSubCategoryThunk({ currentPage, limit: limits, categoryId, search: queryTypeRef.current.value }));
    }

    useEffect(() => {
        getSubCategories()
    }, [dispatch, currentPage, limits,]);

    useEffect(() => {
        setCurrentPage(1);
    }, [location.pathname]);

    const handleDeleteCategory = (categoryId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this Sub Category?");
        if (isConfirmed) {
            dispatch(deleteCategoryThunk({
                categoryType: "subCategory",
                docId: categoryId
            }))
        }
    }

    const { error, isLoading, data } = useSelector((state) => state.category);

    return (
        <Drawer>
            <div className="listMain">
                <h2>Sub Categories</h2>
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
                        <button onClick={() => setUpdatePopup({ categoryId })}>Add Category</button>
                        <input type="text" ref={queryTypeRef} placeholder="Search" onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                getSubCategories();
                            }
                        }} />
                        <button onClick={() => getSubCategories()} className="bi bi-search"></button>
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
                                {data?.subCategories?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center' }}>No Records Found...</td>
                                    </tr>
                                ) : (
                                    data?.subCategories?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {/* <span style={{ color: "green", fontWeight: "bold", fontSize: "12px" }}>{item?.topListed ? "Listed" :""}</span><br /> */}
                                                <img
                                                    src={item?.image}
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
                                            <td><Link to={`/chiledCategory?subCategoryId=${item?._id}`}>{item?.name || 'N/A'}</Link></td>
                                            <td>{item?.count || 0}</td>
                                            <td>
                                                {new Date(item?.createdAt).toLocaleString() || 'N/A'} <br /> <br />
                                            </td>
                                            <td>
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
                    </div>
                )}
                {error && <div className='errDiv'><p>{error}</p></div>}
                {updatePopup && (
                    <Modal isOpen onClose={() => setUpdatePopup(null)}>
                        <UpdateSubCategory
                            categoryData={updatePopup === true ? null : updatePopup} // Pass `null` if it's `true`
                            categoryId={categoryId} // Pass categoryId correctly
                            onClose={() => setUpdatePopup(null)}
                        />
                    </Modal>
                )}
                {imagePreview && <Modal isOpen onClose={() => setImagePreview(null)}>
                    <div style={{ textAlign: 'center' }}>
                        <img src={imagePreview} width={300} height={300} style={{ objectFit: 'contain' }} />
                    </div>
                </Modal>}
            </div>
            <ReactPaginate
                breakLabel='...'
                forcePage={currentPage - 1}
                activePage={3}
                className='pagination margin-16'
                nextLabel='Next'
                activeClassName='active'
                nextClassName='active'
                previousLinkClassName='unactive'
                breakClassName='unactive'
                onPageChange={(x) => {
                    const mPage = x.selected + 1;
                    setCurrentPage(mPage);
                }}
                pageRangeDisplayed={3}
                pageCount={data?.page || 0}
                previousLabel='Previous'
            />
        </Drawer>
    )
}

export default SubCategories;