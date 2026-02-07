import React, { useState } from "react";

const AssignedDrivers = () => {
  // Dummy data for assigned drivers
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      driver_name: "Driver A",
      booking_id: 101,
      tourist_name: "John Doe",
      phone: "0771234567",
      arrival_date: "2026-02-05",
      arrival_time: "09:30",
      travel_days: 3,
      pax: "2",
      status: "assigned",
    },
    {
      id: 2,
      driver_name: "Driver B",
      booking_id: 102,
      tourist_name: "Jane Smith",
      phone: "0719876543",
      arrival_date: "2026-02-06",
      arrival_time: "11:00",
      travel_days: 2,
      pax: "4",
      status: "assigned",
    },
    {
      id: 3,
      driver_name: "Driver C",
      booking_id: 103,
      tourist_name: "Ali Khan",
      phone: "0723344556",
      arrival_date: "2026-02-07",
      arrival_time: "08:45",
      travel_days: 5,
      pax: "3",
      status: "completed",
    },
  ]);

  return (
    <>
      <style>{`
        .container {
          max-width: 1000px;
          margin: 30px auto;
          font-family: Arial, sans-serif;
        }

        h2 {
          text-align: center;
          margin-bottom: 25px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px 15px;
          border: 1px solid #ddd;
          text-align: left;
        }

        th {
          background: #3498db;
          color: white;
        }

        tr:nth-child(even) {
          background: #f9f9f9;
        }

        .status {
          font-weight: bold;
          text-transform: capitalize;
        }

        .status.assigned {
          color: #f39c12;
        }

        .status.completed {
          color: #27ae60;
        }

        .status.cancelled {
          color: #e74c3c;
        }
      `}</style>

      <div className="container">
        <h2>🚗 Assigned Drivers</h2>

        <table>
          <thead>
            <tr>
              <th>Driver</th>
              <th>Tourist</th>
              <th>Phone</th>
              <th>Arrival Date</th>
              <th>Arrival Time</th>
              <th>Travel Days</th>
              <th>Pax</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.id}>
                <td>{a.driver_name}</td>
                <td>{a.tourist_name}</td>
                <td>{a.phone}</td>
                <td>{a.arrival_date}</td>
                <td>{a.arrival_time}</td>
                <td>{a.travel_days}</td>
                <td>{a.pax}</td>
                <td className={`status ${a.status}`}>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AssignedDrivers;
