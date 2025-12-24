import React, { useEffect, useState } from 'react';
import Drawer from '../../components/drawer/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import "./payments.css";
import { fetchPaymentDetailsThunk, updatePaymentDetailsThunk } from '../../store/paymentsSlice';
import Modal from '../../components/modal/Modal';
import { uploadFileThunk } from '../../store/uploadFileSlice';
import Loader from '../../components/loader/Loader';
import { toast } from 'react-toastify';

const PaymentDetailsComponent = () => {
    const dispatch = useDispatch();
    const [showPopup, setShowPopup] = useState(false);
    const { paymentDetails, isLoading, error } = useSelector((state) => state.payments);
    const { isLoading: imgLoading } = useSelector((state) => state.file);

    const [formData, setFormData] = useState({
        accountNo: '',
        bankName: '',
        ifscCode: '',
        holderName: '',
        percentage: '',
        qrCodeUrl: ''
    });

    useEffect(() => {
        dispatch(fetchPaymentDetailsThunk());
    }, [dispatch]);

    useEffect(() => {
        if (paymentDetails) {
            setFormData(paymentDetails);
        }
    }, [paymentDetails]);

    const handleUpdateClick = () => {
        setShowPopup(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formDataPayload = new FormData();
            formDataPayload.append('file', file);
            formDataPayload.append('type', 'qrcode');

            try {
                const resultAction = await dispatch(uploadFileThunk(formDataPayload));
                const uploadedUrl = resultAction.payload;

                if (uploadedUrl) {
                    setFormData(prev => ({
                        ...prev,
                        qrCodeUrl: uploadedUrl // ✅ Set correct URL for update
                    }));
                }
            } catch (error) {
                console.error('File upload failed:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.percentage >= 100) {
            toast.error("Percentage must be less than 100");
            return;
        }
        const result = await dispatch(updatePaymentDetailsThunk(formData));

        if (updatePaymentDetailsThunk.fulfilled.match(result)) {
            setShowPopup(false); // ✅ Close on successful update
        }
    };

    return (
        <Drawer>
            <div className="listMain">
                <div className='searchTab'>
                    <h2 className="page-title">Payment Details</h2>
                    <div>
                        <button onClick={handleUpdateClick}>Update Payment Details</button>
                    </div>
                </div>

                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="payment-card">
                        <div className="payment-info">
                            <p><span>Account No:</span> {paymentDetails?.accountNo}</p>
                            <p><span>Bank Name:</span> {paymentDetails?.bankName}</p>
                            <p><span>IFSC Code:</span> {paymentDetails?.ifscCode}</p>
                            <p><span>Account Holder:</span> {paymentDetails?.holderName}</p>
                            <p><span>Charge %:</span> {paymentDetails?.percentage}%</p>
                        </div>
                        <div className="qr-section">
                            <p><strong>QR Code:</strong></p>
                            <img
                                src={paymentDetails?.qrCodeUrl}
                                alt="QR Code"
                                className="qr-image"
                            />
                        </div>
                    </div>
                )}

                {showPopup && (
                    <Modal isOpen={showPopup} onClose={() => setShowPopup(false)}>
                        <div>
                            <h3>Update Payment Details</h3>
                            <form onSubmit={handleSubmit} className="form-container">
                                <label>Account Number: </label>
                                <input
                                    type="text"
                                    name="accountNo"
                                    value={formData.accountNo}
                                    onChange={handleChange}
                                    placeholder="Account Number"
                                    required
                                />

                                <label>Bank Name:</label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    placeholder="Bank Name"
                                    required
                                />

                                <label>IFSC Code:</label>
                                <input
                                    type="text"
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleChange}
                                    placeholder="IFSC Code"
                                    required
                                />

                                <label>Account Holder Name:</label>
                                <input
                                    type="text"
                                    name="holderName"
                                    value={formData.holderName}
                                    onChange={handleChange}
                                    placeholder="Account Holder Name"
                                    required
                                />

                                <label>Platform Charge (%):</label>
                                <input
                                    type="number"
                                    name="percentage"
                                    onWheel={(e) => e.target.blur()}
                                    value={formData.percentage}
                                    onChange={handleChange}
                                    placeholder="Platform Charge %"
                                    max="99.99"
                                    step="0.01"
                                    required
                                />

                                <label className="qr-upload-label">Upload QR Code Image:</label>
                                <input type="file" accept="image/*" onChange={handleImageUpload} />

                                {formData.qrCodeUrl && (
                                    <div style={{ marginTop: '12px' }}>
                                        <img
                                            src={formData.qrCodeUrl}
                                            alt="Uploaded QR Code"
                                            style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                                        />
                                    </div>
                                )}

                                <div className="form-buttons">
                                    <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
                                    <button type="submit" className='save-button'>Save</button>
                                </div>
                            </form>


                            {imgLoading && <Loader />}
                        </div>
                    </Modal>
                )}
            </div>
            {error && <div className="errDiv"><p>{error}</p></div>}
        </Drawer>
    );
};

export default PaymentDetailsComponent;
