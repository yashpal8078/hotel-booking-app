package com.hotelbooking.hotelbooking.services;

import com.hotelbooking.hotelbooking.dtos.LoginRequest;
import com.hotelbooking.hotelbooking.dtos.RegistrationRequest;
import com.hotelbooking.hotelbooking.dtos.Response;
import com.hotelbooking.hotelbooking.dtos.UserDTO;
import com.hotelbooking.hotelbooking.entities.User;

public interface UserService {

    Response registerUser(RegistrationRequest registrationRequest);
    Response loginUser(LoginRequest loginRequest);
    Response getAllUsers();
    Response getOwnAccountDetails();
    User getCurrentLoggedInUser();
    Response updateOwnAccount(UserDTO userDTO);
    Response deleteOwnAccount();
    Response getMyBookingHistory();
}