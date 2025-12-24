import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFileThunk } from "../../store/uploadFileSlice";
import { addChildCategoryThunk, updateChildCategoryThunk } from "../../store/categorySlice";
import './Category.css';

const AddChildCategory = ({ categoryData, subCategoryId, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        image: "",
        name: "",
        subCategoryId: subCategoryId
    });

    useEffect(() => {
        setFormData({
            image: categoryData?.image || "",
            name: categoryData?.name || "",
            subCategoryId: categoryData?.subCategoryId || subCategoryId || "" // Ensure categoryId is set
        });
    }, [categoryData, subCategoryId]);

    const { isLoading, error } = useSelector((state) => state.category)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append("type", "category");
        formDataUpload.append("file", file);

        const response = await dispatch(uploadFileThunk(formDataUpload));

        // Ensure response contains the correct data path
        if (response.meta.requestStatus === "fulfilled" && response.payload) {
            setFormData((prev) => ({ ...prev, image: response.payload })); // Extract URL correctly
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.image !== '' && formData.name !== '') {
            if (categoryData?._id) {
                // Updating a sub-category
                await dispatch(updateChildCategoryThunk({ childCategoryId: categoryData._id, ...formData }));
            } else {
                // Adding a sub-category: Ensure categoryId is passed
                await dispatch(addChildCategoryThunk(formData));
            }

            onClose();
        }else{
            alert("All fields are required")
        }
    };

    return (
        <div className="update-category-container">
            <h2>{categoryData?._id ? "Update Category" : "Add Category"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Category Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Category Image:</label>
                    {formData.image && (
                        <div className="image-preview">
                            <img src={formData.image} alt="Category" />
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                <button className="button-add" type="submit">{categoryData?._id ? "Update" : "Add"}</button>
            </form>
        </div>
    );
};

export default AddChildCategory;