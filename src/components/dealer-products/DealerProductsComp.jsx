import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateProductBlockingThunk, updateProductListingThunk } from "../../store/approvalsSlice";
import ProductUpdate from "../../pages/dealers/UpdateProduct";
import Modal from "../modal/Modal";
import { useNavigate } from "react-router-dom";

const DealerProductsComp = ({ productsData }) => {
    const dispatch = useDispatch();
    const updatedProducts = useSelector((state) => state.approvals.productsData); // Ensure it's updated from Redux
    const [localProducts, setLocalProducts] = useState(productsData);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    // Sync localProducts with Redux store whenever productsData updates
    useEffect(() => {
        setLocalProducts(updatedProducts || productsData);
    }, [updatedProducts, productsData]);

    const handleUpdate = (productId) => {
        const isConfirmed = window.confirm("Are you sure, you want to update listing for this product?");
        if (isConfirmed) {
            dispatch(updateProductListingThunk({ productId }));
        }
    };

    const handleBlock = (productId) => {
        const isConfirmed = window.confirm("Are you sure, you want to block this product?");
        if (isConfirmed) {
            dispatch(updateProductBlockingThunk({ productId }));
        }
    };

    return (
        <>
            <table className="questionsTable">
                <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Quantity</th>
                        <th>Delivery Fee</th>
                        <th>Stock</th>
                        <th>Packages</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {localProducts?.length > 0 ? (
                        localProducts.map((product, index) => (
                            <tr key={index} style={{ opacity: product?.isBlocked ? 0.5 : 1 }}>
                                <td>{index + 1}</td>
                                <td style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: "green", fontWeight: "bold", fontSize: "12px" }}>
                                        {product?.topListed ? "Listed" : ""}
                                    </span>
                                    <img
                                        src={product?.image}
                                        alt={product?.name}
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            objectFit: "cover",
                                            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                                        }}
                                        onClick={() => setImagePreview(product?.image)}
                                    />
                                </td>
                                <td>{product?.name}</td>
                                <td>{product?.category?.name || "N/A"}</td>
                                <td>₹{product?.price}</td>
                                <td>₹{product?.discount}</td>
                                <td>{product?.quantity}</td>
                                <td>₹{product?.deliveryFee}</td>
                                <td>{product?.stock}</td>
                                <td>
                                    {product?.packages?.map((pkg, index) => (
                                        <div key={index}>
                                            {pkg.count} units - {pkg?.discount} off
                                        </div>
                                    ))}
                                </td>
                                <td>{new Date(product?.createdAt).toLocaleString() || "N/A"}</td>
                                <td>
                                    {/* Update Product Button */}
                                    <button
                                        className="actionButton"
                                        style={{ backgroundColor: product?.topListed ? "green" : "" }}
                                        onClick={() => handleUpdate(product._id)}
                                    >
                                        <span className={product?.topListed ? "bi bi-clipboard-check-fill" : "bi bi-clipboard-check"}></span>
                                    </button>
                                    {/* Block Product Button */}
                                    <button
                                        className="actionButton"
                                        onClick={() => handleBlock(product._id)}
                                        style={{ marginTop: "2px", backgroundColor: product?.isBlocked ? "var(--danger)" : "green" }}
                                    >
                                        <span className="bi bi-ban"></span>
                                    </button>
                                    {/* Open Update Popup */}
                                    <button
                                        className="actionButton"
                                        onClick={() => setSelectedProduct(product)}
                                        style={{ marginTop: "2px" }}
                                    >
                                        <span className="bi bi-pencil"></span>
                                    </button>
                                    <button
                                        className="actionButton"
                                        onClick={() => navigate(`/dealerSupplieProducts?dealerId=${product.dealerId}&approvalStatus=true`)}
                                        style={{ marginTop: "2px" }}
                                    >
                                        <span className="bi bi-eye"></span>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11" style={{ textAlign: "center", padding: "10px" }}>
                                No products available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Update Product Modal */}
            {selectedProduct && (
                <Modal isOpen onClose={() => setSelectedProduct(null)}>
                    <ProductUpdate
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        onUpdateSuccess={() => setSelectedProduct(null)}  // Auto-close on success
                    />
                </Modal>
            )}
            {imagePreview && <Modal isOpen onClose={() => setImagePreview(null)}>
                <div style={{ textAlign: 'center' }}>
                    <img src={imagePreview} width={300} height={300} style={{ objectFit: 'contain' }} />
                </div>
            </Modal>}
        </>
    );
};

export default DealerProductsComp;
