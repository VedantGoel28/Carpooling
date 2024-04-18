import React from "react";

const RideCard = (props) => {
  const rideObj = props.rideObj;
  return (
    <div className="ride-card">
      <div className="ride-card-header">
        <div
          className="ride-location-details"
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            fontFamily: "poppins",
          }}
        >
          <div className="ride-card-from">{rideObj.from}</div>
          <span>{"->"}</span>
          <div className="ride-card-dest">{rideObj.to}</div>
        </div>
        <div
          className="ride-seat-info"
          style={{ fontFamily: "nunito-sans-normal" }}
        >
          <div className="ride-card-available-seats">
            Vacant seats: {rideObj.availableSeats} |
          </div>
          <div className="ride-card-total-seats">
            Total seats: {rideObj.totalSeats}
          </div>
        </div>
      </div>
      <div
        className="ride-card-body"
        style={{ fontFamily: "nunito-sans-normal" }}
      >
        <div className="ride-card-name">Driver's name: {rideObj.name}</div>
        <div className="ride-card-phone">Driver's contact: {rideObj.phone}</div>
        <div className="ride-card-time">Time: {rideObj.time}</div>
      </div>
    </div>
  );
};

export default RideCard;
