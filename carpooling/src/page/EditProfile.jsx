import React, { useState, useEffect, useRef } from 'react';
import '../css/EditProfile.css';
import API from '../api/api';

const EditProfile = () => {

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const isFirstLoad = useRef(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("Saved");

    const token = localStorage.getItem("token");

    // 🔹 Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/users/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(res.data); // ✅ correct for axios
                setLoading(false);
                isFirstLoad.current = false; // ✅ safe here

            } catch (err) {
                console.log("Error fetching profile", err);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const onClose = () => {
        window.history.back();
    };

    // 🔹 Save to DB    

    useEffect(() => {
        if (isFirstLoad.current) return; // ✅ correct now

        setSaving(true);
        setStatus("Saving...");

        const timer = setTimeout(async () => {
            try {
                await API.put("/users/profile", user, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setSaving(false);
                setStatus("Saved");

            } catch (err) {
                setSaving(false);
                setStatus("Error saving");
            }

        }, 500);

        return () => clearTimeout(timer);

    }, [user , token]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="details-overlay">
            <div className="details-container">

                <header className="details-header">
                    <button className="close-btn" onClick={onClose}>✕</button>
                </header>

                <h1 className="details-title">Personal details</h1>

                <div className='auto-save'>
                    {saving ? (
                        <span style={{ color: "orange" }}>🟡 Saving...</span>
                    ) : (
                        <span style={{ color: "green" }}>🟢 {status}</span>
                    )}
                </div>

                <div className="details-list">

                    {/* First Name */}
                    <div className="detail-item">
                        <label>First name</label>
                        <input
                            className="detail-input"
                            value={user.firstName || ""}
                            onChange={(e) =>
                                setUser({ ...user, firstName: e.target.value })
                            }
                        />
                    </div>

                    {/* Last Name */}
                    <div className="detail-item">
                        <label>Last name</label>

                        <input
                            className="detail-input"
                            value={user.lastName || ""}
                            onChange={(e) =>
                                setUser({ ...user, lastName: e.target.value })
                            }
                        />
                    </div>

                    {/* Email (READ ONLY) */}
                    <div className="detail-item">
                        <label>Email</label>
                        <p>{user.email}</p>
                    </div>

                    {/* Mobile */}
                    <div className="detail-item">
                        <label>Mobile</label>

                        <input
                            className="detail-input"
                            value={user.mobile || ""}
                            onChange={(e) =>
                                setUser({ ...user, mobile: e.target.value })
                            }
                        />
                    </div>

                    {/* Bio */}
                    <div className="detail-item">
                        <label>Bio</label>

                        <input
                            className="detail-input"
                            value={user.bio || ""}
                            onChange={(e) =>
                                setUser({ ...user, bio: e.target.value })
                            }
                        />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default EditProfile;