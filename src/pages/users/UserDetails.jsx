import { useDispatch, useSelector } from "react-redux";
import Drawer from "../../components/drawer/Drawer";
import { useEffect } from "react";
import { fetchUserDetailsThunk } from "../../store/usersSlice";
import { useLocation } from "react-router-dom";
import "./users.css";
import Loader from "../../components/loader/Loader";
import defaulImg from "../../assets/gallery_default.png";

const UserDetails = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const userId = params.get("userId");

    const { error, isLoading, detailsData } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchUserDetailsThunk({ userId }));
    }, [dispatch, userId]);

    return (
        <Drawer>
            <div className="listMain">
                <div className="user-details">
                    <h2>User Details</h2>
                    <div className="profile-section">
                        <img src={detailsData?.image || defaulImg} alt="User Profile" className="profile-image" />
                        <div className="profile-info">
                            <p><strong>Name:</strong> {detailsData?.name}</p>
                            <p><strong>Email:</strong> {detailsData?.email}</p>
                            <p><strong>Mobile:</strong> {detailsData?.mobile}</p>
                            <p><strong>Source:</strong> {detailsData?.source}</p>
                            <p><strong>Version:</strong> {detailsData?.version}</p>
                            <p><strong>Device ID:</strong> {detailsData?.deviceId}</p>
                            <p><strong>Blocked:</strong> {detailsData?.blocked ? "Yes" : "No"}</p>
                        </div>
                    </div>

                    <h3>Default Location</h3>
                    <div className="location-card">
                        <p><strong>Title:</strong> {detailsData?.defaultLocation?.titleName}</p>
                        <p><strong>Address:</strong> {detailsData?.defaultLocation?.address1}, {detailsData?.defaultLocation?.city}</p>
                        <p><strong>State:</strong> {detailsData?.defaultLocation?.state}</p>
                        <p><strong>Landmark:</strong> {detailsData?.defaultLocation?.landMark}</p>
                        <p><strong>Pin Code:</strong> {detailsData?.defaultLocation?.pinCode}</p>
                    </div>

                    <h3>Other Locations</h3>
                    <div className="locations-list">
                        {detailsData?.locations?.map((location) => (
                            <div key={location._id} className="location-card">
                                <p><strong>Title:</strong> {location.titleName}</p>
                                <p><strong>Address:</strong> {location.address1}, {location.city}</p>
                                <p><strong>State:</strong> {location.state}</p>
                                <p><strong>Landmark:</strong> {location.landMark}</p>
                                <p><strong>Pin Code:</strong> {location.pinCode}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {isLoading && <Loader />}
                {error && <div className="errDiv"><p>{error}</p></div>}
            </div>
        </Drawer>
    );
};

export default UserDetails;
