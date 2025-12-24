import React from "react";
import "./dealerDetails.css"

const DealerDetails = ({ dealerData, dealerId, defaultBuilding }) => {
    return (
        <div
            className="approval-card"
            style={{ overflow: "hidden", marginTop: "4px", width: '100%' }}
        >
            {/* Company Image */}
            <div className="card-image">
                <img
                    src={dealerData?.companyImage || defaultBuilding}
                    alt="Company"
                    onError={(e) => (e.target.src = defaultBuilding)}
                    width="100%"
                    height={350}
                    style={{ objectFit: "cover" }}
                />
            </div>

            {/* Company Details */}
            <div className="card-content">
                {/* Column 1 - Basic Info */}
                <div className="card-section">
                    <h3 className="company-name">{dealerData?.companyName || "N/A"}</h3>
                    <p className="owner-name">Owner: {dealerData?.name || "N/A"}</p>
                    <p><strong>Email:</strong> {dealerData?.email || "N/A"}</p>
                    <p><strong>Mobile:</strong> {dealerData?.mobile || "N/A"}</p>
                    <p><strong>About Company:</strong> {dealerData?.aboutCompany || "N/A"}</p>
                    <p><strong>GST IN:</strong> {dealerData?.gstIn || "N/A"}</p>

                    <p>
                        <strong>Company Licence:</strong>{" "}
                        <a href={dealerData?.companyLicence} target="_blank" rel="noopener noreferrer">
                            View PDF
                        </a>
                    </p>
                    <p><strong>Approval Status:</strong> {dealerData?.approvalStatus || "N/A"}</p>
                </div>

                {/* Column 2 - Address & Taxes */}
                <div className="card-section">
                    <h4>Address:</h4>
                    <p><strong>Street:</strong> {dealerData?.location?.address1 || "N/A"}</p>
                    <p><strong>City:</strong> {dealerData?.location?.city || "N/A"}</p>
                    <p><strong>State:</strong> {dealerData?.location?.state || "N/A"}</p>
                    <p><strong>Landmark:</strong> {dealerData?.location?.landMark || "N/A"}</p>
                    <p><strong>Pin Code:</strong> {dealerData?.location?.pinCode || "N/A"}</p>

                    {/* Primary Account Details */}
                    {dealerData?.primaryAccountDetails && (
                        <div className="account-section">
                            <div className="account-header">
                                <div className="account-icon">
                                    {dealerData.primaryAccountDetails.accountType === "bank" ? (
                                        <span className="bank-icon">🏦</span>
                                    ) : (
                                        <span className="upi-icon">📱</span>
                                    )}
                                </div>
                                <div className="account-title">
                                    <h4>Primary Account Details</h4>
                                    <span className={`account-badge ${dealerData.primaryAccountDetails.accountType}`}>
                                        {dealerData.primaryAccountDetails.accountType === "bank" ? "Bank Account" : "UPI"}
                                    </span>
                                </div>
                            </div>

                            {dealerData.primaryAccountDetails.accountType === "bank" ? (
                                <div className="bank-details-card">
                                    <div className="bank-card-header">
                                        <div className="bank-logo-placeholder">
                                            <span className="bank-logo">{dealerData.primaryAccountDetails.accountDetails?.bankName?.charAt(0) || "B"}</span>
                                        </div>
                                        <div className="bank-info">
                                            <h5 className="bank-name">{dealerData.primaryAccountDetails.accountDetails?.bankName || "Bank Name"}</h5>
                                            <p className="account-type">{dealerData.primaryAccountDetails.accountDetails?.accountType + " Account" || "Savings Account"}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="account-number-display">
                                        <span className="account-number">
                                            {dealerData.primaryAccountDetails.accountDetails?.accountNumber?.replace(/(\d{4})(?=\d)/g, "$1 ") || "XXXX XXXX XXXX"}
                                        </span>
                                    </div>
                                    
                                    <div className="account-details-grid">
                                        <div className="detail-item">
                                            <label>Account Holder</label>
                                            <span className="detail-value">{dealerData.primaryAccountDetails.accountDetails?.fullName || "N/A"}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>IFSC Code</label>
                                            <span className="detail-value ifsc-code">{dealerData.primaryAccountDetails.accountDetails?.ifscCode || "N/A"}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="verified-badge">
                                        <span className="verified-icon">✓</span>
                                        Verified Account
                                    </div>
                                </div>
                            ) : (
                                <div className="upi-details-card">
                                    <div className="upi-header">
                                        <span className="upi-logo">💸</span>
                                        <h5>UPI Payment</h5>
                                    </div>
                                    <div className="upi-id-display">
                                        <span className="upi-id">{dealerData.primaryAccountDetails.upiId || "N/A"}</span>
                                    </div>
                                    <div className="upi-note">
                                        <p>Use this UPI ID for instant payments</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* {dealerData?.taxes?.length > 0 && (
                        <>
                            <h4>Taxes</h4>
                            <ul>
                                {dealerData.taxes.map((tax, index) => (
                                    <li key={index}>{tax.name}: {tax.percentage}%</li>
                                ))}
                            </ul>
                        </>
                    )} */}
                </div>

                {/* Column 3 - Supplies & Additional Info */}
                <div className="card-section">

                    {dealerData?.availableSupplies?.length > 0 && (
                        <>
                            <h4>Available Supplies</h4>
                            <div className="supply-list">
                                {dealerData.availableSupplies.map((supply, index) => (
                                    <div key={index} className="supply-item">
                                        <img src={supply.image} alt={supply.name} width="50" height="50" />
                                        <p>{supply.name} ({supply.count})</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <p><strong>Created At:</strong> {new Date(dealerData?.createdAt).toLocaleString()}</p>
                </div>
            </div>

        </div>
    );
};

export default DealerDetails;