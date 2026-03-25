import React, { useState, useEffect, useRef } from "react";
import ApiService from "../../service/ApiService";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const RoomSearch = ({ handSearchResult }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndtDate] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState("");

  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.log("Error fetching RoomTypes" + error);
      }
    };
    fetchRoomTypes();
  }, []);

  const handleClickOutside = (event) => {
    if (startDateRef.current && !startDateRef.current.contains(event.target)) setStartDatePickerVisible(false);
    if (endDateRef.current && !endDateRef.current.contains(event.target)) setEndDatePickerVisible(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showError = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => setError(""), timeout);
  };

  const handleInternalSearch = async () => {
    if (!startDate || !endDate) {
      showError("Please select check-in and check-out dates");
      return false;
    }
    try {
      const formattedStartDate = startDate ? startDate.toLocaleDateString("en-CA") : null;
      const formattedEndDate = endDate ? endDate.toLocaleDateString("en-CA") : null;
      const resp = await ApiService.getAvailableRooms(formattedStartDate, formattedEndDate, roomType);
      if (resp.status === 200) {
        if (resp.rooms.length === 0) {
          showError("No rooms available for the selected dates and type.");
          return;
        }
        handSearchResult(resp.rooms);
        setError("");
      }
    } catch (error) {
      showError(error?.response?.data?.message || error.message);
    }
  };

  return (
    <section>
      <div className="search-bar-wrap">
        <div className="airbnb-search-bar">
          {/* Check-in */}
          <div className="search-segment" style={{ position: "relative" }} ref={startDateRef}>
            <span className="search-segment-label">Check-in</span>
            <input
              type="text"
              value={startDate ? startDate.toLocaleDateString() : ""}
              placeholder="Add date"
              onFocus={() => setStartDatePickerVisible(true)}
              readOnly
            />
            {isStartDatePickerVisible && (
              <div className="datepicker-container">
                <DayPicker
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => { setStartDate(date); setStartDatePickerVisible(false); }}
                  month={startDate}
                />
              </div>
            )}
          </div>

          {/* Check-out */}
          <div className="search-segment" style={{ position: "relative" }} ref={endDateRef}>
            <span className="search-segment-label">Check-out</span>
            <input
              type="text"
              value={endDate ? endDate.toLocaleDateString() : ""}
              placeholder="Add date"
              onFocus={() => setEndDatePickerVisible(true)}
              readOnly
            />
            {isEndDatePickerVisible && (
              <div className="datepicker-container">
                <DayPicker
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => { setEndtDate(date); setEndDatePickerVisible(false); }}
                  month={startDate}
                />
              </div>
            )}
          </div>

          {/* Room Type */}
          <div className="search-segment">
            <span className="search-segment-label">Room type</span>
            <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
              <option value="">Any type</option>
              {roomTypes.map((type) => (
                <option value={type} key={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="search-btn-wrap">
            <button className="search-go-btn" onClick={handleInternalSearch}>
              🔍 Search
            </button>
          </div>
        </div>
        {error && <p className="error-message" style={{ maxWidth: 860, marginTop: 8 }}>{error}</p>}
      </div>
    </section>
  );
};

export default RoomSearch;
