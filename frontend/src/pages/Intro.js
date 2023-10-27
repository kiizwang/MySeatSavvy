import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import axios from "axios";
import Banner from "../components/Banner.js";

const Intro = () => {
  const [restaurant, setRestaurant] = useState(null);

  // useEffect(() => {
  //   axios
  //     .get("/api/restaurants")
  //     .then((response) => {
  //       setRestaurant(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);

  // if (!restaurant) return <div>Loading...</div>;

  useEffect(() => {
    fetch("/api/restaurants")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setRestaurant(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <main>
      <div className="main">
        <Banner />
        <div className="content">
          <section className="restaurant-info">
            {/* <h1>{restaurant.name}</h1> */}
            <h1>The Rich Uncle Tavern</h1>
            <div className="restaurant-info-wrapping">
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">restaurant</span>
                </div>
                <p>Gastro Pub, Canadian, Burgers</p>
              </div>
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">payments</span>
                </div>
                <p>Credit Card, Mastercard, UnionPay via TheFork Pay, Visa</p>
              </div>
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">storefront</span>
                </div>
                <p>
                  45 King St W, Kitchener, ON N2G 1A1 <a href="#">View Map</a>
                </p>
              </div>
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">call</span>
                </div>
                <p>
                  <a href="#">(519) 208-8555</a>
                </p>
              </div>
            </div>
          </section>

          <section className="restaurant-content">
            <div className="restaurant-content-wrapping">
              <p>
                With a unique, inventive menu, The Rich Uncle Tavern is built on hearty live-fire fare and shareable
                snacks that pay homage to the brasseries and taverns of yesteryear. Defined by our humble and wholesome
                approach to food and beverage, The Rich Uncle Tavern features a charming and homely ambience for patrons
                to gather with old friends and find some new ones.
              </p>
              <p>
                Whether you’re partaking in a crafted cocktail during live music or a late-night bite in one of our
                booths, you’ll be able to experience a sociable atmosphere, curated beverages and delicious fare that
                will leave you sated.
              </p>
            </div>
          </section>

          <section className="restaurant-menu">
            <div className="restaurant-menu-wrapping">
              <h2>Menu</h2>
            </div>
          </section>
        </div>
        <div className="sidebar">
          <section className="reservation-info">
            <h2>Make A Reservation</h2>
            <div className="reservation-info-wrapping">
              <form action="" method="" className="reservation-form">
                <div>
                  <label>Party Size</label>
                  <select id="party_size" defaultValue="2 people">
                    <option>1 person</option>
                    <option>2 people</option>
                    <option>3 people</option>
                    <option>4 people</option>
                    <option>5 people</option>
                    <option>6 people</option>
                    <option>7 people</option>
                    <option>8 people</option>
                  </select>
                </div>
                <div>
                  <label>Date</label>
                  <input type="date" id="reservation_date" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
                <div>
                  <label>Time</label>
                  <select id="reservation_time" defaultValue="7:00 p.m.">
                    <option>5:00 p.m.</option>
                    <option>5:30 p.m.</option>
                    <option>6:00 p.m.</option>
                    <option>6:30 p.m.</option>
                    <option>7:00 p.m.</option>
                    <option>7:30 p.m.</option>
                    <option>8:00 p.m.</option>
                    <option>8:30 p.m.</option>
                    <option>9:00 p.m.</option>
                    <option>9:30 p.m.</option>
                    <option>10:00 p.m.</option>
                    <option>10:30 p.m.</option>
                    <option>11:00 p.m.</option>
                    <option>11:30 p.m.</option>
                  </select>
                </div>
                <div>
                  <input type="submit" value="Submit" />
                </div>
              </form>
            </div>
          </section>

          <section className="restaurant-hours">
            <h2>Hours of Operation</h2>
            <div className="reservation-hours-wrapping">
              <table className="hours-table">
                <tr>
                  <td>Monday</td>
                  <td>11:30 a.m. - 03:00 p.m.</td>
                </tr>
                <tr>
                  <td></td>
                  <td>05:30 p.m. - 22:30 p.m.</td>
                </tr>
                <tr>
                  <td>Tuesday</td>
                  <td>Closed</td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>Closed</td>
                </tr>
                <tr>
                  <td>Thursday</td>
                  <td>11:30 a.m. - 03:00 p.m.</td>
                </tr>
                <tr>
                  <td></td>
                  <td>05:30 p.m. - 22:30 p.m.</td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>11:30 a.m. - 03:00 p.m.</td>
                </tr>
                <tr>
                  <td></td>
                  <td>05:30 p.m. - 22:30 p.m.</td>
                </tr>
                <tr>
                  <td>Saturday</td>
                  <td>11:30 a.m. - 03:00 p.m.</td>
                </tr>
                <tr>
                  <td></td>
                  <td>05:30 p.m. - 22:30 p.m.</td>
                </tr>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Intro
