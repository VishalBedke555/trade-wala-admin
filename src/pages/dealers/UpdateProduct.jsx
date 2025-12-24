import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchDealerSupplieProductsThunk, fetchSupplieProductDetailsThunk, updateSupplieProductThunk } from "../../store/approvalsSlice";
import "./UpdateProduct.css"; // Import the CSS file
import Loader from "../../components/loader/Loader";
import defaultImage from "../../assets/gallery_default.png"
import { uploadFileThunk } from "../../store/uploadFileSlice";

const ProductUpdate = ({ product, onUpdateSuccess }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const dealerId = params.get("dealerId")

    const { productDetails, isLoading, error } = useSelector((state) => state.approvals);
    const { isLoading: imgLoading, error: imgError } = useSelector((state) => state.approvals);

    const [formData, setFormData] = useState({
        dealerId: "",
        productId: "",
        image: "",
        name: "",
        bio: "",
        metricUnit: "",
        price: 0,
        discount: 0,
        quantity: 1,
        deliveryFee: 0,
        packages: [],  // Ensure packages are part of the state
        kmRangeCharges: []
    });

    useEffect(() => {
        if (product?._id) {
            dispatch(fetchSupplieProductDetailsThunk({ productId: product._id }));
        }
    }, [dispatch, product?._id]);

    useEffect(() => {
        if (productDetails) {
            setFormData({
                dealerId: productDetails?.productDetails.dealerId || "",
                productId: productDetails?.productDetails._id || "",
                image: productDetails?.productDetails.image || "",
                name: productDetails?.productDetails.name || "",
                bio: productDetails?.productDetails.bio || "",
                metricUnit: productDetails?.productDetails.metricUnit || "",
                price: productDetails?.productDetails.price || 0,
                discount: productDetails?.productDetails.discount || 0,
                quantity: productDetails?.productDetails.quantity || 1,
                deliveryFee: productDetails?.productDetails.deliveryFee || 0,
                packages: productDetails?.productDetails.packages || [], // Ensure packages are set
                kmRangeCharges: productDetails?.productDetails?.kmRangeCharges || []
            });
        }
    }, [productDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await dispatch(updateSupplieProductThunk(formData));

        if (response.meta.requestStatus === "fulfilled") {
            onUpdateSuccess();
        }
    };
    const handlePackageChange = (index, field, value) => {
        const updatedPackages = [...formData.packages];
        updatedPackages[index] = { ...updatedPackages[index], [field]: value };
        setFormData({ ...formData, packages: updatedPackages });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create FormData object to send multipart/form-data
        const formDataUpload = new FormData();
        formDataUpload.append("type", "product");
        formDataUpload.append("file", file);

        // Dispatch upload thunk
        const response = await dispatch(uploadFileThunk(formDataUpload));

        // If upload is successful, update formData with the image URL
        if (response.meta.requestStatus === "fulfilled" && response.payload) {
            const uploadedImageUrl = response.payload; // Extract URL from response

            setFormData((prev) => ({ ...prev, image: uploadedImageUrl }));
        }
    };

    const handleKmRangeChange = (index, field, value) => {
        const updatedKmRangeCharges = [...formData.kmRangeCharges];
        updatedKmRangeCharges[index] = { ...updatedKmRangeCharges[index], [field]: value };
        setFormData({ ...formData, kmRangeCharges: updatedKmRangeCharges });
    };


    return (
        <div className="product-update-container">
            <h2 className="product-update-title">Update Product</h2>

            {isLoading && <Loader />}
            {!isLoading && error && (
                <div className="errDiv">
                    <p>{error}</p>
                </div>
            )}

            <form className="product-update-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Product Image:</label>
                    <div>
                        <img
                            src={formData.image ? formData.image : defaultImage}
                            width={200}
                            height={200}
                            alt="Product"
                            style={{ objectFit: 'contain', border: '1px solid #ccc' }}
                            onError={(e) => e.target.src = defaultImage} // Fallback if image fails to load
                        />
                    </div>
                    <input type="file" accept="image/*" name="product" onChange={handleFileChange} />
                </div>

                <div className="form-group">
                    <label>Bio:</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Metric Unit:</label>
                    <input type="text" name="metricUnit" value={formData.metricUnit} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Price:</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} onWheel={(e) => e.target.blur()} />
                </div>

                <div className="form-group">
                    <label>Discount:</label>
                    <input type="number" name="discount" value={formData.discount} onChange={handleChange} onWheel={(e) => e.target.blur()} />
                </div>

                <div className="form-group">
                    <label>Quantity:</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} onWheel={(e) => e.target.blur()} />
                </div>

                <div className="form-group">
                    <label>Packages:</label>
                    {formData.packages.map((pkg, index) => (
                        <div key={index} className="package-group">
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label>Count</label>
                                <input
                                    type="number"
                                    value={pkg.count}
                                    onChange={(e) => handlePackageChange(index, "count", Number(e.target.value))}
                                    placeholder="Package Count"
                                    onWheel={(e) => e.target.blur()}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label>Discount</label>
                                <input
                                    type="number"
                                    value={pkg.discount}
                                    onChange={(e) => handlePackageChange(index, "discount", Number(e.target.value))}
                                    placeholder="Package Discount"
                                    onWheel={(e) => e.target.blur()}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-group">
                    <label>Delivery Fee:</label>
                    <input type="number" name="deliveryFee" value={formData.deliveryFee} onChange={handleChange} onWheel={(e) => e.target.blur()} />
                </div>
                <div className="form-group">
                    <label>KM Range Charges:</label>
                    {formData?.kmRangeCharges?.map((rangeCharge, index) => (
                        <div key={index} className="package-group">
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label>Range</label>
                                <select
                                    value={rangeCharge.range}
                                    onChange={(e) => handleKmRangeChange(index, "range", e.target.value)}
                                >
                                    {productDetails?.ranges?.map((item, idx) => (
                                        <option key={idx} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label>Charges</label>
                                <input
                                    type="number"
                                    value={rangeCharge.charges} // Fixed: Use rangeCharge.charges
                                    onChange={(e) => handleKmRangeChange(index, "charges", Number(e.target.value))}
                                    placeholder="Charges"
                                    onWheel={(e) => e.target.blur()}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit" className="product-update-button">Update Product</button>
            </form>

            {imgLoading && <Loader />}
            {imgError && <div className="errDiv"><p>{error}</p></div>}
        </div>
    );
};

export default ProductUpdate;