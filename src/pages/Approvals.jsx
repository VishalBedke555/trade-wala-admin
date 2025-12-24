import React, { useEffect, useRef, useState } from 'react';
import Drawer from '../components/drawer/Drawer';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/loader/Loader';
import './approvals.css';
import ReactPaginate from 'react-paginate';
import Modal from '../components/modal/Modal';
import { fetchApprovalsThunk, updateCompanyApprovalStatusThunk } from '../store/approvalsSlice';
import defaultBuilding from '../assets/building1.png'
import Ranges from './ranges/Ranges';

const Approvals = ({ approvalStatus, isFromDealer }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [limits, setLimits] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedFields, setSelectedFields] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const queryTypeRef = useRef('');

  const getDealers = () => {
    dispatch(fetchApprovalsThunk({ currentPage, limit: limits, approvalStatus, search: queryTypeRef.current.value }));
  }

  useEffect(() => {
    getDealers()
  }, [dispatch, currentPage, limits, navigate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [location.pathname]);

  const { error, isLoading, data, pageCount } = useSelector((state) => state.approvals);

  const handleRejectApproval = (item) => {
    setIsRejectModalOpen(item);
    setSelectedFields([]);
  };

  const handleRejectApprovalSubmit = () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    const payload = {
      dealerId: isRejectModalOpen._id,
      approved: false,
      reason: rejectReason,
      rejectedFields: selectedFields,
    };

    dispatch(updateCompanyApprovalStatusThunk(payload));
    setIsRejectModalOpen(false); // Close modal
    setRejectReason(""); // Clear the input
    setSelectedFields([]);
  };

  const handleAcceptApproval = (item) => {
    const payload = {
      dealerId: item._id,
      approved: true, // Accept approval
      reason: "",
    };
    const isConfirm = window.confirm("Are you sure you want to accept this approval?");
    if (isConfirm) {
      dispatch(updateCompanyApprovalStatusThunk(payload));
    }
  };

  const handleFieldChange = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field)
        ? prev.filter((item) => item !== field) // Remove if already selected
        : [...prev, field] // Add if not selected
    );
  };

  return (
    <Drawer>
      <div className="listMain">
        <h2>{isFromDealer ? "All" : approvalStatus.charAt(0).toUpperCase() + approvalStatus.slice(1)} Approvals</h2>
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
            {/* <span style={{ paddingRight: '6px' }}>Search </span> */}
            <button onClick={() => setOpenPopup(true)}>Kilometer Range</button>
            <input type="text" ref={queryTypeRef} placeholder="Search" onKeyDown={(e) => {
              if (e.key === 'Enter') {
                getDealers();
                setCurrentPage(1)
              }
            }} />
            <button onClick={() => {getDealers(); setCurrentPage(1)}} className="bi bi-search"></button>
          </div>
        </div>
        {isLoading && <Loader />}

        <div className="approvals-container">
          {data?.length === 0 ? (
            <p className="no-records">No Records Found...</p>
          ) : (
            data?.map((item) => (
              <div key={item._id} className="approval-card" style={{cursor:'pointer'}} onClick={() => navigate(`/dealerSupplieProducts?dealerId=${item?._id}&approvalStatus=${String(isFromDealer)}`)}>
                <div className="card-header">
                  <img
                    src={item?.companyImage || defaultBuilding}
                    alt="Company"
                    className="company-img"
                    onError={(e) => (e.target.src = defaultBuilding)}
                  />
                </div>
                <div className="card-body" >
                  <h3 className="company-name">{item?.companyName || "N/A"}</h3>
                  <p className="owner-name">Owner: {item?.name || "N/A"}</p>
                  <p><strong>Email:</strong> {item?.email || "N/A"}</p>
                  <p><strong>Mobile:</strong> {item?.mobile || "N/A"}</p>
                  {/* <p><strong>About:</strong> {item?.aboutCompany || "N/A"}</p>
                  <p><strong>Address:</strong> {item?.location?.address || "N/A"}</p>
                  <p><strong>State:</strong> {item?.location?.state || "N/A"}</p> */}
                  <p><strong>Created:</strong> {new Date(item?.createdAt).toLocaleString()}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                    <p className="view-details" style={{ color: "#3498db", padding: '0px' }}
                      onClick={() => navigate(`/dealerSupplieProducts?dealerId=${item?._id}&approvalStatus=${String(isFromDealer)}`)}>
                      <u>View Details</u>
                    </p>
                  </div>

                  {approvalStatus === "rejected" ? (
                    <p className="rejected-reason"><strong>Reason:</strong> {item?.reason}</p>
                  ) : (
                    <div className="card-actions">
                      <button className="reject-btn" onClick={() => handleRejectApproval(item)}>
                        <i className="bi bi-x-circle"></i> Reject
                      </button>
                      {approvalStatus !== "approved" && (
                        <button className="approve-btn" onClick={() => handleAcceptApproval(item)}>
                          <i className="bi bi-check-circle"></i> Approve
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {openPopup &&
          <Ranges isOpen={openPopup} onClose={() => setOpenPopup(null)} />
        }

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
      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(null)}>
        <div className="reject-modal">
          <h2 style={{ color: 'var(--text-secondery)' }}>Provide Reason for Rejection</h2>
          <h3>Select Fields to Reject</h3>
          <div className="fields-checkbox-group">
            <ul style={{ lineHeight: '32px', listStyle: 'none', paddingLeft: '0px' }}>
              {["companyName", "email", "mobile", "aboutCompany", "location", "companyImage", "companyLicence"].map((field) => (
                <li key={field}>
                  <label className="field-checkbox" >
                    <input
                      type="checkbox"
                      value={field}
                      checked={selectedFields.includes(field)}
                      onChange={() => handleFieldChange(field)}
                      style={{ marginRight: '10px' }}
                    />
                    {field}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <textarea
            placeholder="Enter reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="approval-textarea"
          />
          <div className="modal-actions">
            <button className="actionButton" style={{ backgroundColor: 'var(--danger)' }} onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </button>
            <button className="actionButton" onClick={handleRejectApprovalSubmit}>
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </Drawer>
  );
}

export default Approvals;