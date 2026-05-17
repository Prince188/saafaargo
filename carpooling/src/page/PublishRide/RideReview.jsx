import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft, FiMapPin, FiCalendar, FiClock,
  FiUsers, FiInfo, FiUpload, FiCheckCircle,
  FiAlertCircle, FiX, FiFileText, FiShield
} from "react-icons/fi";
import { FaCar, FaArrowRight, FaIdCard } from "react-icons/fa";

// ─────────────────────────────────────────────────────────────────────────────
// DocumentUploadModal
// ─────────────────────────────────────────────────────────────────────────────
const DocumentUploadModal = ({ onClose, onSubmit, isSubmitting }) => {
  const [dlFile, setDlFile] = useState(null);
  const [rcFile, setRcFile] = useState(null);
  const [dlPreview, setDlPreview] = useState(null);
  const [rcPreview, setRcPreview] = useState(null);
  const [error, setError] = useState("");
  const dlRef = useRef();
  const rcRef = useRef();

  const handleFile = (file, type) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowed.includes(file.type)) { setError("Only JPG, PNG or PDF files are allowed."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Each file must be under 5 MB."); return; }
    setError("");
    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    if (type === "dl") { setDlFile(file); setDlPreview(preview); }
    else { setRcFile(file); setRcPreview(preview); }
  };

  const handleSubmit = () => {
    if (!dlFile || !rcFile) { setError("Please upload both Driving Licence and RC Book."); return; }
    onSubmit(dlFile, rcFile);
  };

  const UploadBox = ({ label, tag, fileVal, previewVal, inputRef, fieldType, Icon }) => (
    <div>
      <label className="text-[11px] font-semibold tracking-widest text-stone uppercase mb-2 block">{label}</label>
      <div
        onClick={() => inputRef.current.click()}
        className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all duration-200 flex items-center gap-4
          ${fileVal ? "border-sage bg-sage-soft/30" : "border-sage-soft bg-off-white hover:border-sage hover:bg-sage-soft/20"}`}
      >
        <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden"
          onChange={(e) => handleFile(e.target.files[0], fieldType)} />
        {previewVal
          ? <img src={previewVal} alt="preview" className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
          : <div className="w-14 h-14 bg-sage-soft rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="text-sage text-2xl" />
          </div>
        }
        <div className="flex-1 min-w-0">
          {fileVal
            ? <><p className="text-sm font-semibold text-forest truncate">{fileVal.name}</p>
              <p className="text-[11px] text-sage mt-0.5">{(fileVal.size / 1024).toFixed(0)} KB · Tap to change</p></>
            : <><p className="text-sm font-semibold text-forest">Upload {tag}</p>
              <p className="text-[11px] text-stone mt-0.5">JPG, PNG or PDF · Max 5 MB</p></>
          }
        </div>
        {fileVal
          ? <FiCheckCircle className="text-sage text-lg flex-shrink-0" />
          : <FiUpload className="text-stone text-base flex-shrink-0" />
        }
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">

        {/* Header */}
        <div className="relative bg-gradient-primary px-6 py-5">
          <button onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
            <FiX className="text-sm" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl">
              <FiShield />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg leading-tight">Verify Your Identity</h2>
              <p className="text-white/75 text-xs mt-0.5">Required once to publish rides as a driver</p>
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div className="mx-5 mt-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
          <FiAlertCircle className="text-amber-500 flex-shrink-0 mt-0.5 text-base" />
          <p className="text-amber-700 text-xs leading-relaxed">
            Our team will review your documents. Your ride will go live <strong>automatically</strong> once approved.
            This is a <strong>one-time process</strong>.
          </p>
        </div>

        {/* Upload boxes */}
        <div className="px-5 py-4 space-y-4">
          <UploadBox label="Driving Licence (DL)" tag="DL Image" fileVal={dlFile} previewVal={dlPreview} inputRef={dlRef} fieldType="dl" Icon={FaIdCard} />
          <UploadBox label="Vehicle RC Book" tag="RC Book Image" fileVal={rcFile} previewVal={rcPreview} inputRef={rcRef} fieldType="rc" Icon={FiFileText} />

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <FiAlertCircle className="text-red-500 flex-shrink-0 text-base" />
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-6 flex gap-3">
          <button onClick={onClose} disabled={isSubmitting}
            className="flex-1 border-2 border-sage-soft text-stone bg-transparent rounded-full py-3 text-sm font-semibold transition-all hover:bg-off-white disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting || !dlFile || !rcFile}
            className="flex-1 bg-gradient-primary text-white border-none rounded-full py-3 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0">
            {isSubmitting ? "Submitting…" : "Submit & Publish"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PendingBanner — shown when docs are already submitted but not yet approved
// ─────────────────────────────────────────────────────────────────────────────
const PendingBanner = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4">
    <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
      <div className="p-8 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
          <FiShield className="text-amber-500 text-3xl" />
        </div>
        <div>
          <h3 className="text-forest font-semibold text-lg">Verification In Progress</h3>
          <p className="text-stone text-sm mt-2 leading-relaxed">
            Your documents are under review. Your ride has been saved and will go live
            <strong> automatically</strong> once you're approved. We'll notify you soon.
          </p>
        </div>
        <button onClick={onClose}
          className="w-full bg-gradient-primary text-white border-none rounded-full py-3 text-sm font-bold">
          Got it
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// RideReview — main page
// ─────────────────────────────────────────────────────────────────────────────
const RideReview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    pickup,
    destination,
    stops = [],
    selectedCar,
    date,
    time,
    seats: seatsFromState,
    ratePerKm,
    formData,
  } = location.state || {};

  const seats = seatsFromState || parseInt(formData?.passengers) || 1;

  const [showDocModal, setShowDocModal] = useState(false);
  const [showPendingBanner, setShowPendingBanner] = useState(false);
  const [isSubmittingDocs, setIsSubmittingDocs] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const [year, month, day] = dateString.split("-");
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
  };

  // ── POST the ride to backend ──────────────────────────────────────────────
  const publishRide = async () => {
    setIsPublishing(true);
    try {
      const token = localStorage.getItem("token");
      const formattedStops = stops.slice(0, -1).map(s => ({
        lat: s.lat, lng: s.lng, address: s.address,
        city: s.city, displayName: s.displayName, price: s.price
      }));

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/rides`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pickup, destination, stops: formattedStops, date, time, seatsAvailable: seats, perkmprice: ratePerKm, car: selectedCar })
      });

      const data = await res.json();
      
      if (!res.ok) { alert(data.message || "Failed to save ride"); return false; }
      return true;
    } catch (err) {
      console.error("publishRide error:", err);
      alert("Something went wrong");
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  // ── Button click: check verification status first ─────────────────────────
  const handlePublishClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/rides/driver/verification-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.driverVerified) {
        // ✅ Already verified → publish immediately, go to my-rides
        const ok = await publishRide();
        if (ok) { alert("Ride published successfully 🚀"); navigate("/my-rides"); }

      } else if (data.driverVerificationStatus === "pending") {
        // ⏳ Docs submitted but not yet approved → save ride as pending, show banner
        const ok = await publishRide();
        if (ok) setShowPendingBanner(true);

      } else {
        // 🆕 "none" or "rejected" → ask for DL + RC
        setShowDocModal(true);
      }

    } catch (err) {
      console.error("Verification check failed:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  // ── Modal submit: upload docs then publish ────────────────────────────────
  const handleDocSubmit = async (dlFile, rcFile) => {
    setIsSubmittingDocs(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("dlImage", dlFile);
      formData.append("rcImage", rcFile);

      const docRes = await fetch(`${process.env.REACT_APP_API_URL}/api/rides/driver/submit-documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const docData = await docRes.json();
      if (!docRes.ok) { alert(docData.message || "Failed to upload documents"); return; }

      // Now save the ride (backend will assign status:"pending" since not verified yet)
      const ok = await publishRide();
      if (!ok) return;

      setShowDocModal(false);
      setShowPendingBanner(true);

    } catch (err) {
      console.error("Doc submit error:", err);
      alert("Something went wrong uploading documents");
    } finally {
      setIsSubmittingDocs(false);
    }
  };

  // ── No data guard ─────────────────────────────────────────────────────────
  if (!pickup || !destination) {
    return (
      <div className="min-h-screen bg-off-white font-inter">
        <div className="max-w-[1000px] mx-auto bg-white min-h-screen shadow-sm">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-lg text-center py-2xl px-xl">
            <FiInfo className="text-5xl text-clay" />
            <h3 className="text-xl text-forest">No ride data found</h3>
            <p className="text-sm text-stone">Please go back and complete all steps</p>
            <button onClick={() => navigate(-1)}
              className="bg-gradient-primary text-white border-none px-6 py-2.5 rounded-full cursor-pointer">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-off-white font-inter">
      <div className="max-w-[1000px] mx-auto bg-white min-h-screen shadow-sm">

        {showDocModal && (
          <DocumentUploadModal
            onClose={() => setShowDocModal(false)}
            onSubmit={handleDocSubmit}
            isSubmitting={isSubmittingDocs}
          />
        )}
        {showPendingBanner && (
          <PendingBanner onClose={() => { setShowPendingBanner(false); navigate("/my-rides"); }} />
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-xl py-4 md:py-lg border-b border-sage-soft sticky top-0 bg-white z-10">
          <button
            className="w-8 h-8 md:w-10 md:h-10 bg-transparent border border-sage-soft rounded-full flex items-center justify-center cursor-pointer text-forest transition-all duration-base hover:bg-sage-soft hover:-translate-x-0.5"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft className="text-sm md:text-base" />
          </button>
          <div className="flex items-center gap-1 md:gap-sm">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">
                  {step <= 2 ? "✓" : step}
                </div>
                {step < 4 && <div className="w-4 md:w-8 h-px bg-sage-soft" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="text-center px-4 md:px-xl py-6 md:py-2xl">
          <h1 className="font-fraunces text-2xl md:text-3xl font-semibold text-forest mb-1 md:mb-sm">
            Review your <span className="text-transparent bg-clip-text bg-gradient-primary">ride</span>
          </h1>
          <p className="text-xs md:text-sm text-stone">Double-check everything before publishing</p>
        </div>

        {/* Route Card */}
        <div className="bg-off-white rounded-md p-4 md:p-lg mx-4 md:mx-xl mb-4 md:mb-lg transition-all duration-base hover:-translate-y-0.5 hover:shadow-sm animate-fade-in-up">
          <div className="flex items-center gap-2 md:gap-sm mb-3 md:mb-lg pb-2 md:pb-sm border-b border-sage-soft">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-sage-soft rounded-sm flex items-center justify-center text-sage text-base md:text-xl">
              <FiMapPin />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-forest">Route Details</h3>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center pb-2 gap-2 md:gap-md overflow-y-auto
            [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <div className="flex items-center gap-2 md:gap-sm bg-white p-2 md:p-sm px-3 md:px-md rounded-md shadow-sm">
              <div className="px-2 py-1 rounded-full text-[9px] md:text-[10px] font-bold bg-success/15 text-success">START</div>
              <div className="flex flex-col">
                <span className="text-[8px] md:text-[9px] font-semibold tracking-[0.05em] text-stone uppercase">Pickup</span>
                <span className="text-xs md:text-[13px] font-semibold text-forest">{pickup?.displayName?.split(",")[0]}</span>
              </div>
            </div>

            <div className="text-sage-light text-base md:text-lg font-semibold rotate-90 md:rotate-0 self-center">→</div>

            {stops.map((stop, index) => {
              const isLast = index === stops.length - 1;
              return (
                <React.Fragment key={index}>
                  <div className="flex items-center gap-2 md:gap-sm bg-white p-2 md:p-sm px-3 md:px-md rounded-md shadow-sm">
                    <div className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-bold ${isLast ? "bg-clay/15 text-clay" : "bg-sage-soft text-sage"}`}>
                      {isLast ? "END" : index + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] md:text-[9px] font-semibold tracking-[0.05em] text-stone uppercase">
                        {isLast ? "Destination" : "Stop"}
                      </span>
                      <span className="text-xs md:text-[13px] font-semibold text-forest text-nowrap">{stop?.displayName?.split(",")[0]}</span>
                      <small className="text-[10px] text-sage text-nowrap">₹ {stop.pricePerSeat || stop.price || "—"} /seat</small>
                    </div>
                  </div>
                  {!isLast && <div className="text-sage-light text-base md:text-lg font-semibold rotate-90 md:rotate-0 self-center">→</div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Vehicle + Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-lg mx-4 md:mx-xl mb-4 md:mb-lg">
          <div className="bg-off-white rounded-md p-4 md:p-lg transition-all duration-base hover:-translate-y-0.5 hover:shadow-sm animate-fade-in-up">
            <div className="flex items-center gap-2 md:gap-sm mb-3 md:mb-md pb-2 md:pb-sm border-b border-sage-soft">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-sage-soft rounded-sm flex items-center justify-center text-sage text-base md:text-lg"><FaCar /></div>
              <h3 className="text-sm md:text-base font-semibold text-forest">Vehicle</h3>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-md text-center sm:text-left">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-primary rounded-md flex items-center justify-center text-white text-xl md:text-2xl"><FaCar /></div>
              <div>
                <h4 className="text-sm md:text-[15px] font-bold text-forest mb-0.5">{selectedCar?.brand} {selectedCar?.model}</h4>
                <div className="flex items-center justify-center sm:justify-start gap-1 md:gap-xs text-[10px] md:text-[11px] text-stone mb-0.5">
                  <span>{selectedCar?.color}</span>
                  <span className="text-sage-light">•</span>
                  <span>{selectedCar?.seats} seats</span>
                </div>
                <p className="text-[9px] md:text-[10px] font-mono text-stone bg-white px-1.5 py-0.5 md:px-2 md:py-1 rounded-sm inline-block">{selectedCar?.numberPlate}</p>
              </div>
            </div>
          </div>

          <div className="bg-off-white rounded-md p-4 md:p-lg transition-all duration-base hover:-translate-y-0.5 hover:shadow-sm animate-fade-in-up">
            <div className="flex items-center gap-2 md:gap-sm mb-3 md:mb-md pb-2 md:pb-sm border-b border-sage-soft">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-sage-soft rounded-sm flex items-center justify-center text-sage text-base md:text-lg"><FiCalendar /></div>
              <h3 className="text-sm md:text-base font-semibold text-forest">Schedule</h3>
            </div>
            <div className="flex flex-col gap-2 md:gap-md">
              {[
                { Icon: FiCalendar, label: "Date", value: formatDate(date) },
                { Icon: FiClock, label: "Time", value: time },
                { Icon: FiUsers, label: "Seats", value: `${seats} seats available` },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2 md:gap-md">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-sm flex items-center justify-center text-sage text-xs md:text-sm"><Icon /></div>
                  <div className="flex-1">
                    <span className="text-[9px] md:text-[10px] font-semibold tracking-[0.05em] text-stone uppercase block">{label}</span>
                    <span className="text-xs md:text-[13px] font-semibold text-forest">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Publish Button */}
        <div className="flex gap-3 md:gap-md px-4 md:px-xl pb-6 md:pb-2xl">
          <button
            disabled={isPublishing}
            onClick={handlePublishClick}
            className="flex-1 inline-flex items-center justify-center gap-2 md:gap-md bg-gradient-primary border-none rounded-full py-2.5 md:py-3 text-xs md:text-sm font-bold text-white cursor-pointer transition-all duration-base hover:-translate-y-0.5 hover:gap-3 md:hover:gap-lg hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {isPublishing ? "Please wait…" : "Publish Ride"}
            {!isPublishing && <FaArrowRight />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default RideReview;