import React from "react";

const formatTime12Hour = (time24) => {
  const [hours, minutes] = time24.split(":");
  const hoursInt = parseInt(hours, 10);
  const suffix = hoursInt >= 12 ? "PM" : "AM";
  const hours12 = (((hoursInt + 11) % 12) + 1).toString().padStart(2, "0");
  return `${hours12}:${minutes} ${suffix}`;
};

const Hours = ({ restaurants }) => {
  return (
    <section className="restaurant-hours">
      <h2>Hours of Operation</h2>
      <div className="restaurant-hours-wrapping">
        <table className="table table-sm">
          {restaurants.length > 0 ? (
            restaurants[0].days.map((dayInfo) => (
              <React.Fragment key={dayInfo.day}>
                {dayInfo.status === "Open" ? (
                  dayInfo.time_slots.map((slot, index) => (
                    <tr key={index}>
                      {index === 0 && <td>{dayInfo.day}</td>}
                      {index !== 0 && <td></td>}
                      <td>{`${formatTime12Hour(slot.start)} - ${formatTime12Hour(slot.end)}`}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>{dayInfo.day}</td>
                    <td>{dayInfo.status}</td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td>Loading...</td>
              <td>Loading...</td>
            </tr>
          )}
        </table>
      </div>
    </section>
  );
};

export default Hours;
