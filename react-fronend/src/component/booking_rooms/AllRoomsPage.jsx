import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";

const AllRoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(9);

    const handleSearchResult = (results) => {
        setRooms(results);
        setFilteredRooms(results);
    };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const resp = await ApiService.getAllRooms();
                setRooms(resp.rooms);
                setFilteredRooms(resp.rooms);
            } catch (error) { console.log(error); }
        };
        const fetchRoomsType = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) { console.log(error); }
        };
        fetchRooms();
        fetchRoomsType();
    }, []);

    const handleRoomTypeChange = (type) => {
        setSelectedRoomType(type);
        setCurrentPage(1);
        if (type === "") {
            setFilteredRooms(rooms);
        } else {
            setFilteredRooms(rooms.filter((r) => r.type === type));
        }
    };

    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="all-rooms">
            <h2>Our Rooms</h2>

            <RoomSearch handSearchResult={handleSearchResult} />
            <RoomResult roomSearchResults={currentRooms} />

            <Pagination
                roomPerPage={roomsPerPage}
                totalRooms={rooms.length}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    );
};

export default AllRoomsPage;