import { useState } from "react";
import "./Category.css";
import Drawer from "../../components/drawer/Drawer";
import { useDispatch, useSelector } from "react-redux";
import { updateProductListingThunk } from "../../store/approvalsSlice";

const DynamicInputs = () => {
    const dispatch = useDispatch();
    const [input, setInput] = useState("");
    const [listedProducts, setListedProducts] = useState([]);

    const { isLoading, error, productsData } = useSelector((state) => state.approvals);

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = () => {
        console.log("Submitted:", input);
        dispatch(updateProductListingThunk({ productId: input }));

        // Simulating product listing update
        const foundProduct = productsData?.find((product) => product._id === input);
        if (foundProduct) {
            setListedProducts((prev) => [...prev, foundProduct]);
        }
    };

    return (
        <Drawer>
            <div className="listMain">
                <div className="list-main">
                    <div className="dynamic-container">
                        <div className="dynamic-card">
                            <h2 className="dynamic-title">Top Listing</h2>
                            <div className="dynamic-input-group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={handleChange}
                                    placeholder="Enter Product ID"
                                    className="dynamic-input"
                                />
                                <button onClick={handleSubmit} className="dynamic-submit-btn">
                                    Submit
                                </button>
                            </div>

                            {isLoading && <p className="loading-message">Updating product listing...</p>}
                            {error && <p className="error-message">Error: {error}</p>}
                        </div>

                        {/* Listed Product Details */}
                        <div className="listed-products">
                            <h3 className="listed-title">Listed Products</h3>
                            {listedProducts.length === 0 ? (
                                <p className="no-products-message">No products listed yet.</p>
                            ) : (
                                listedProducts?.map((product) => (
                                    <div key={product._id} className="listed-product-card">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="listed-product-image"
                                        />
                                        <div className="listed-product-details">
                                            <h4 className="product-name">{product.name}</h4>
                                            <p className="product-bio">{product.bio}</p>
                                            <p className="product-price">Price: ${product.price}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default DynamicInputs;
