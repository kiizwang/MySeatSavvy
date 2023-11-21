import React from "react";

const formatTime12Hour = (time24) => {
  const [hours, minutes] = time24.split(":");
  const hoursInt = parseInt(hours, 10);
  const suffix = hoursInt >= 12 ? "PM" : "AM";
  const hours12 = (((hoursInt + 11) % 12) + 1).toString().padStart(2, "0");
  return `${hours12}:${minutes} ${suffix}`;
};

const Hours = ({ restaurant }) => {
  return (
    <section className="restaurant-hours">
      <h3 className="text-center">Hours of Operation</h3>
      <div className="restaurant-hours-wrapping">
        <table className="table table-sm">
          <tbody>
            {restaurant ? (
              restaurant.days.map((dayInfo) => (
                <React.Fragment key={dayInfo.day}>
                  {dayInfo.status === "Open" ? (
                    dayInfo.hour_ranges.map((slot, index) => (
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
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Hours;
