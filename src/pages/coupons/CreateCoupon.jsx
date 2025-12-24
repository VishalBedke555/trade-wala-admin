import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./coupons.css";
import { createCouponThunk } from "../../store/couponsSlice";
import Drawer from "../../components/drawer/Drawer";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";

const CreateCoupon = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        expiryDate: "",
        code: "",
        discount: "",
        orderValue: ""
    });

    const { error, isLoading, status } = useSelector((state) => state.coupons);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            expiryDate: new Date(formData.expiryDate).toISOString(),
            code: formData.code,
            discount: Number(formData.discount),
            orderValue: formData.orderValue
        };
        dispatch(createCouponThunk(payload));
    };

    // Use useEffect to navigate after successful creation
    useEffect(() => {
        if (status === 1) {
            navigate(-1);
        }
    }, [status, navigate]);

    return (
        <Drawer>
            <div className="listMain">
                <div className="coupon-container">
                    <h2>Create Coupon</h2>
                    <form onSubmit={handleSubmit} className="coupon-form">
                        <div className="form-group">
                            <label>Expiry Date</label>
                            <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Coupon Code</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="Enter Code"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Discount (₹)</label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                placeholder="Enter Discount"
                                required
                                onWheel={(e)=>e.target.blur()}
                            />
                        </div>
                        <div className="form-group">
                            <label>Minimum order value (₹)</label>
                            <input
                                type="number"
                                name="orderValue"
                                value={formData.orderValue}
                                onChange={handleChange}
                                placeholder="Enter minimum order value"
                                required
                                onWheel={(e)=>e.target.blur()}
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Coupon"}
                        </button>
                    </form>
                </div>
                {isLoading && <Loader/>}
            </div>
        </Drawer>
    );
};

export default CreateCoupon;
