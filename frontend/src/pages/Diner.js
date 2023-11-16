import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Banner from "../components/Banner.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { fetchRestaurants } from "../store/restaurantsSlice.js";
import { useSelector, useDispatch } from "react-redux";
import Hours from "../components/Hours.js";
import { Divider, Grid, IconButton, TextField, Typography } from "@mui/material";
import { Box, style } from "@mui/system";
import { faCcMastercard } from "@fortawesome/free-brands-svg-icons/faCcMastercard";
import { faPhone, faLocationDot, faUtensils, faClock } from "@fortawesome/free-solid-svg-icons";
import { grey } from "@mui/material/colors";

const Diner = () => {
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants.entities);
  const restaurantsStatus = useSelector((state) => state.restaurants.status);
  useEffect(() => {
    if (restaurantsStatus === "idle") {
      dispatch(fetchRestaurants());
    }
  }, [restaurantsStatus, dispatch]);
  const navigate = useNavigate();
  console.log("Samhitha ", restaurants);
  //State management of reservation details
  const [reservationDetails, setReservationDetails] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    specialRequest: "",
  });
  const handleChange = (e, field) => {
    setReservationDetails({ ...reservationDetails, [field]: e.target.value });
  };

  function validateName(name) {
    const namePattern = /^[a-zA-Z]{2,}$/;
    return namePattern.test(name);
  }

  function validatePhoneNumber(phoneNumber) {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phoneNumber);
  }

  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  const customBackButtonStyle = {
    backgroundColor: "#FFFFFF",
    color: "#000000",
  };

  const disableSubmitButton =
    reservationDetails.email.length > 0 &&
    reservationDetails.firstName.length > 0 &&
    reservationDetails.lastName.length > 0 &&
    reservationDetails.phoneNumber.length > 0 &&
    validateEmail(reservationDetails.email) &&
    validateName(reservationDetails.firstName) &&
    validateName(reservationDetails.lastName) &&
    validatePhoneNumber(reservationDetails.phoneNumber);

  const customButtonStyle = {
    backgroundColor: disableSubmitButton ? "#FFD300" : grey,
    color: "#000000",
  };

  const submitReservations = () => {
    if (disableSubmitButton) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: reservationDetails.firstName,
          lastname: reservationDetails.lastName,
          email: reservationDetails.email,
          phone: reservationDetails.phoneNumber,
          note: reservationDetails.specialRequest,
          date: "november 14 2023",
          time: "2:40 PM",
          restaurant_id: restaurants[0]._id,
          table_id: "65528b55abb074ab31e0fd0b",
        }),
      };
      fetch("http://localhost:4000/reservations", requestOptions)
        .then((response) => response.json())
        .then((data) => navigate(`/submission`));
    }
  };

  return (
    <main>
      <div className="main">
        <Banner bannerImage={restaurants.length > 0 ? restaurants[0].banner_image : ""} />
        <div className="content">
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h3" fontWeight="600">
              {" "}
              {restaurants.length > 0 ? restaurants[0].name : "Loading..."}
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton sx={{ mr: "16px" }} disableFocusRipple>
                <FontAwesomeIcon icon={faUtensils} />
              </IconButton>
              <Typography>2 Adults </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton sx={{ mr: "16px" }} disableFocusRipple>
                <FontAwesomeIcon icon={faClock} />
              </IconButton>
              <Typography>Time</Typography>
            </Box>
            <Divider />
            <Typography variant="h4" fontWeight="600" style={{ paddingTop: "8px" }}>
              Dinner Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  error={!validateName(reservationDetails.firstName) && reservationDetails.firstName.length > 0}
                  helperText={
                    !validateName(reservationDetails.firstName) && reservationDetails.firstName.length > 0
                      ? "Please Enter valid First Name"
                      : ""
                  }
                  name="firstName"
                  label="First Name"
                  placeholder="First Name"
                  variant="outlined"
                  value={reservationDetails.firstName}
                  onChange={(e) => {
                    handleChange(e, "firstName");
                  }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  error={!validateName(reservationDetails.lastName) && reservationDetails.lastName.length > 0}
                  helperText={
                    !validateName(reservationDetails.lastName) && reservationDetails.lastName.length > 0
                      ? "Please Enter valid Last Name"
                      : ""
                  }
                  name="lastName"
                  label="Last Name"
                  placeholder="Last Name"
                  variant="outlined"
                  value={reservationDetails.lastName}
                  onChange={(e) => {
                    handleChange(e, "lastName");
                  }}
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  error={
                    !validatePhoneNumber(reservationDetails.phoneNumber) && reservationDetails.phoneNumber.length > 0
                  }
                  helperText={
                    !validatePhoneNumber(reservationDetails.phoneNumber) && reservationDetails.phoneNumber.length > 0
                      ? "Please enter valid Phone Number"
                      : ""
                  }
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="Phone Number"
                  variant="outlined"
                  value={reservationDetails.phoneNumber}
                  onChange={(e) => {
                    handleChange(e, "phoneNumber");
                  }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  error={!validateEmail(reservationDetails.email) && reservationDetails.email.length > 0}
                  helperText={
                    !validateEmail(reservationDetails.email) && reservationDetails.email.length > 0
                      ? "Please Enter valid Email"
                      : ""
                  }
                  name="email"
                  label="Email"
                  placeholder="Email"
                  variant="outlined"
                  value={reservationDetails.email}
                  onChange={(e) => {
                    handleChange(e, "email");
                  }}
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  name="specialRequests"
                  label="Ask for any special requests"
                  placeholder="Ask for any special requests"
                  variant="outlined"
                  value={reservationDetails.specialRequest}
                  onChange={(e) => {
                    handleChange(e, "specialRequest");
                  }}
                  margin="normal"
                  minRows="3"
                />
              </Grid>
            </Grid>

            <Button
              disabled={!disableSubmitButton}
              onClick={submitReservations}
              variant="contained"
              style={customButtonStyle}
              sx={{ marginTop: "16px" }}
            >
              Submit
            </Button>
            <Button variant="contained" sx={{ marginTop: "16px" }} style={customBackButtonStyle}>
              Back
            </Button>
          </Box>
        </div>
        <div className="sidebar">
          <div className="content">
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography align="center" variant="h5" fontWeight="600">
                {" "}
                Restaurant Information
              </Typography>
              <br></br>
              <Box display="flex" alignItems="left">
                <IconButton sx={{ mr: "16px" }} disableFocusRipple>
                  <FontAwesomeIcon icon={faUtensils} />
                </IconButton>
                <Typography paddingTop={1}> {restaurants.length > 0 ? restaurants[0].type : "Loading..."}</Typography>
              </Box>
              <Box display="flex" alignItems="left">
                <IconButton sx={{ mr: "16px" }} disableFocusRipple>
                  <FontAwesomeIcon icon={faCcMastercard} />
                </IconButton>
                <Typography paddingTop={1}>
                  {restaurants.length > 0 ? restaurants[0].payments : "Loading..."}
                </Typography>
              </Box>
              <Box display="flex" alignItems="left">
                <IconButton sx={{ mr: "16px" }} disableFocusRipple>
                  <FontAwesomeIcon icon={faLocationDot} />
                </IconButton>
                <Typography paddingTop={1}>{restaurants.length > 0 ? restaurants[0].address : "Loading..."}</Typography>
              </Box>
              <Box display="flex" alignItems="left">
                <IconButton sx={{ mr: "16px" }} disableFocusRipple>
                  <FontAwesomeIcon icon={faPhone} />
                </IconButton>
                <Typography paddingTop={1}>{restaurants.length > 0 ? restaurants[0].phone : "Loading..."}</Typography>
              </Box>
            </Box>
            <br></br>
            <Divider />
            <br></br>
            <div className="content">
              <Hours restaurants={restaurants} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Diner;
