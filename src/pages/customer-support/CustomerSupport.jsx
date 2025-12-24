import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Drawer from "../../components/drawer/Drawer";
import {
    fetchCustomerSupportDetailsThunk,
    updateCustomerSupportDetailsThunk,
} from "../../store/customerSupportSlice";
import './style.css'

const CustomerSupport = () => {
    const dispatch = useDispatch();
    const { data, isLoading } = useSelector((state) => state.customerSupport);

    const [formData, setFormData] = useState({
        userSupport: "",
        dealerSupport: "",
    });

    // Fetch data on mount
    useEffect(() => {
        dispatch(fetchCustomerSupportDetailsThunk());
    }, [dispatch]);

    // Populate form when data is fetched
    useEffect(() => {
        if (data) {
            setFormData({
                userSupport: data.userSupport || "",
                dealerSupport: data.dealerSupport || "",
            });
        }
    }, [data]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateCustomerSupportDetailsThunk(formData));
    };

    return (
        <Drawer>
            <div className="cs-main-container">
                <div className="cs-form-card">
                    <h2 className="cs-form-header">Customer Support Contact Form</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="cs-form-group">
                            <label className="cs-form-label">User Support Mobile</label>
                            <input
                                type="tel"
                                name="userSupport"
                                value={formData.userSupport}
                                onChange={handleChange}
                                className="cs-form-input"
                                placeholder="Enter support number"
                                required
                            />
                        </div>

                        <div className="cs-form-group">
                            <label className="cs-form-label">Dealer Support Mobile</label>
                            <input
                                type="tel"
                                name="dealerSupport"
                                value={formData.dealerSupport}
                                onChange={handleChange}
                                className="cs-form-input"
                                placeholder="Enter dealer support number"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="cs-submit-btn"
                        >
                            {isLoading ? "Saving..." : "Update Contact"}
                        </button>
                    </form>
                </div>
            </div>
        </Drawer>
    );
};

export default CustomerSupport;
