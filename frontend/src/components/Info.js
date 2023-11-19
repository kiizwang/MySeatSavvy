import React from 'react'

const Info = ({ restaurants }) => {
  return (
    <section className="restaurant-side-info restaurant-side-info-secondary">
      <h2>Restaurant Information</h2>
      <div className="restaurant-side-info-wrapping">
        <div className="icon-p-wrapper">
          <div className="icon-wrapper">
            <span className="material-icons-outlined material-symbols-outlined">restaurant</span>
          </div>
          <span>{restaurants.length > 0 ? restaurants[0].type : "Loading..."}</span>
        </div>
        <div className="icon-p-wrapper">
          <div className="icon-wrapper">
            <span className="material-icons-outlined material-symbols-outlined">payments</span>
          </div>
          <span>{restaurants.length > 0 ? restaurants[0].payments : "Loading..."}</span>
        </div>
        <div className="icon-p-wrapper">
          <div className="icon-wrapper">
            <span className="material-icons-outlined material-symbols-outlined">storefront</span>
          </div>
          <span>
            {restaurants.length > 0 ? restaurants[0].address : "Loading..."} <a href="#">View Map</a>
          </span>
        </div>
        <div className="icon-p-wrapper">
          <div className="icon-wrapper">
            <span className="material-icons-outlined material-symbols-outlined">call</span>
          </div>
          <span>
            <a href="#">{restaurants.length > 0 ? restaurants[0].phone : "Loading..."}</a>
          </span>
        </div>
      </div>
    </section>
  );
};

export default Info