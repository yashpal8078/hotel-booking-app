import React from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";

const RoomResult = ({ roomSearchResults }) => {
    const navigate = useNavigate();
    const isAdmin = ApiService.isAdmin();

    if (!roomSearchResults || roomSearchResults.length === 0) return null;

    return (
        <section className="room-results">
            <div className="room-list">
                {roomSearchResults.map((room) => (
                    <div className="airbnb-card" key={room.id}>
                        <div className="airbnb-card-image-wrap">
                            <img src={room.imageUrl} alt={room.type} loading="lazy" />
                            <button className="airbnb-card-heart" title="Save">♡</button>
                        </div>
                        <div className="airbnb-card-body">
                            <div className="airbnb-card-row">
                                <span className="airbnb-card-title">{room.type}</span>
                                <span className="airbnb-card-rating">⭐ 4.8</span>
                            </div>
                            <p className="airbnb-card-subtitle">Room {room.roomNumber} · {room.capacity && `Up to ${room.capacity} guests`}</p>
                            <p className="airbnb-card-subtitle" style={{ marginTop: 4, fontSize: 13 }}>{room.description?.slice(0, 70)}{room.description?.length > 70 ? "…" : ""}</p>
                            <p className="airbnb-card-price"><strong>₹{room.pricePerNight}</strong> / night</p>
                            {isAdmin ? (
                                <button className="edit-room-button" onClick={() => navigate(`/admin/edit-room/${room.id}`)}>
                                    ✏️ Edit Room
                                </button>
                            ) : (
                                <button className="airbnb-card-btn" onClick={() => navigate(`/room-details/${room.id}`)}>
                                    View &amp; Book
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RoomResult;