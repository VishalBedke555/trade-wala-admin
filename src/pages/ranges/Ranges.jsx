import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/modal/Modal";
import { useEffect, useState } from "react";
import { fetchKmRangesThunk, addKmRangeThunk, removeKmRangeThunk } from "../../store/rangeSlice";
import Loader from "../../components/loader/Loader";
import './Ranges.css';

const Ranges = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { data, isLoading, error } = useSelector((state) => state.ranges);
    const [startRange, setStartRange] = useState("");
    const [endRange, setEndRange] = useState("");

    useEffect(() => {
        dispatch(fetchKmRangesThunk());
    }, [dispatch]);

    const handleAddRange = () => {
        if (startRange.trim() === "" || endRange.trim() === "") return;
    
        const rangePayload = {
            startRange: Number(startRange),
            endRange: Number(endRange)
        };
    
        dispatch(addKmRangeThunk(rangePayload));
        setStartRange("");
        setEndRange("");
    };
    
    const handleRemoveRange = (range) => {
        const [start, end] = range.split("-"); // Extract startRange and endRange
        console.log(start, end)
        const rangePayload = {
            startRange: Number(start),
            endRange: Number(end)
        };
    
        dispatch(removeKmRangeThunk(rangePayload));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="range-container">
                <h2>Add Kilometer Range</h2>
                <div className="input-group">
                    <input
                        type="number"
                        value={startRange}
                        onChange={(e) => setStartRange(e.target.value)}
                        placeholder="Start Range"
                        onWheel={(e)=>e.target.blur()}
                    />
                    <input
                        type="number"
                        value={endRange}
                        onChange={(e) => setEndRange(e.target.value)}
                        placeholder="End Range"
                        onWheel={(e)=>e.target.blur()}
                    />
                    <button onClick={handleAddRange}>Add</button>
                </div>

                <div className="range-list">
                    {data?.map((item, index) => (
                        <div key={index} className="range-item">
                            <p>{item} km</p>
                            <button className="delete-btn" onClick={() => handleRemoveRange(item)}>
                                ✖
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {isLoading && <Loader />}
            {error && <div className="errDiv"><p>{error}</p></div>}
        </Modal>
    );
};

export default Ranges;
