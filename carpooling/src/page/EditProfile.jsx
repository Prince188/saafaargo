import React, { useState, useEffect, useRef } from 'react';
import '../css/EditProfile.css';
import API from '../api/api'; 
import { FaShieldAlt } from 'react-icons/fa';

const EditProfile = () => {

    const [user, setUser] = useState({});
    const isFirstLoad = useRef(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("Saved");

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [removeImage, setRemoveImage] = useState(false);

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

                setUser(res.data);
                isFirstLoad.current = false;

            } catch (err) {
                console.log("Error fetching profile", err);
            }
        };

        fetchProfile();
    }, [token]);

    const onClose = () => {
        window.history.back();
    };

    // 🔹 Handle Img Change
    const handleImageChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setRemoveImage(false);
        }
    };

    // 🔹 Remove image
    const removeProfilePic = () => {
        setFile(null);
        setPreview("");
        setUser({ ...user, profilePic: "" });
        setRemoveImage(true);
    };

    // 🔥 AUTO SAVE (FIXED)
    useEffect(() => {
        if (isFirstLoad.current) return;

        setSaving(true);
        setStatus("Saving...");

        const timer = setTimeout(async () => {
            try {
                const formData = new FormData();

                formData.append("firstName", user.firstName || "");
                formData.append("lastName", user.lastName || "");
                formData.append("mobile", user.mobile || "");
                formData.append("bio", user.bio || "");

                if (file) {
                    formData.append("profilePic", file);
                }

                if (removeImage) {
                    formData.append("removeProfilePic", "true");
                }

                await API.put("/users/profile", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setSaving(false);
                setStatus("Saved");

                setFile(null);
                setRemoveImage(false);

            } catch (err) {
                setSaving(false);
                setStatus("Error saving");
            }

        }, 500);

        return () => clearTimeout(timer);

    }, [
        user.firstName,
        user.lastName,
        user.mobile,
        user.bio,
        file,
        removeImage,
        token
    ]);


    return (

        <div className="profile-container">
            <div className="profile-card">

                <header className="profile-header">
                    <button className="close-btn" onClick={onClose}>✕</button>
                    <h2>Personal details</h2>

                    <span className="status-badge">
                        {saving ? "Saving..." : status}
                    </span>
                </header>

                {/* Profile Image Section */}
                <section className="profile-identity">
                    <div className="avatar-wrapper">
                        <img
                            src={preview || user.profilePic || "https://i.pravatar.cc/150"}
                            alt="Profile"
                            className="profile-img"
                        />
                    </div>

                    <div className="identity-content">
                        <h3>Profile Identity</h3>
                        <p>Update your photo to reflect your current professional look.</p>

                        <div className="action-buttons">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                                id="upload-img"
                            />

                            <label htmlFor="upload-img" className="btn-primary">
                                Change
                            </label>

                            <button className="btn-link" onClick={removeProfilePic}>
                                Remove
                            </button>
                        </div>
                    </div>
                </section>

                {/* Form Section */}
                <div className="form-grid">

                    <div className="form-group">
                        <label>FIRST NAME</label>
                        <input
                            type="text"
                            value={user.firstName || ""}
                            onChange={(e) =>
                                setUser({ ...user, firstName: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>EMAIL ADDRESS</label>
                        <input
                            type="email"
                            value={user.email || ""}
                            readOnly
                            className='email-edit'
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label>LAST NAME</label>
                        <input
                            type="text"
                            value={user.lastName || ""}
                            onChange={(e) =>
                                setUser({ ...user, lastName: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>MOBILE NUMBER</label>
                        <input
                            type="text"
                            value={user.mobile || ""}
                            onChange={(e) =>
                                setUser({ ...user, mobile: e.target.value })
                            }
                        />
                    </div>

                </div>

                {/* Bio Section */}
                <section className="bio-section">
                    <div className="section-header">
                        <div>PERSONAL BIO</div>
                        <div className="char-count">
                            {(user.bio || "").length} / 500
                        </div>
                    </div>

                    <textarea
                        value={user.bio || ""}
                        maxLength={500}
                        onChange={(e) =>
                            setUser({ ...user, bio: e.target.value })
                        }
                    />
                </section>

                {/* Footer */}
                <footer className="privacy-footer">
                    <div className="privacy-info">
                        <div className="privacy-icon">
                            <FaShieldAlt size={20} color="var(--primary-green)" />
                        </div>

                        <div className="privacy-text">
                            <h4>Data Privacy</h4>
                            <p>
                                Your personal information is encrypted and never shared with third parties.
                            </p>
                        </div>
                    </div>

                    {/* <button className="manage-link">
                        Manage Privacy
                    </button> */}
                </footer>

            </div>
        </div>
    );
};

export default EditProfile;