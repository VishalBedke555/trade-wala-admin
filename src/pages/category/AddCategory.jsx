import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { uploadFileThunk } from "../../store/uploadFileSlice";
import { addCategoryThunk, updateCategoryThunk } from "../../store/categorySlice";
import './Category.css';

const UpdateCategory = ({ categoryData, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        image: "",
        name: ""
    });

    useEffect(() => {
        if (categoryData) {
            setFormData({
                image: categoryData.image || "",
                name: categoryData.name || ""
            });
        }
    }, [categoryData]);

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
    
        if (response.meta.requestStatus === "fulfilled" && response.payload) {
            setFormData((prev) => ({ ...prev, image: response.payload })); // Ensure the correct data path
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.image !== "" && formData.name !== ""){
            if (categoryData?._id) {
                await dispatch(updateCategoryThunk({ categoryId: categoryData._id, ...formData }));
            } else {
                await dispatch(addCategoryThunk(formData));
            }
            onClose();
        }else{
            alert("All fields are required!")
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

export default UpdateCategory;
