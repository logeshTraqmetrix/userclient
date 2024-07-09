import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const DeliveryBoy = ({ id, serverUrl }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(serverUrl);
    setSocket(newSocket);

    return () => newSocket.close();
  }, [serverUrl]);

  useEffect(() => {
    const intervalId = setInterval(getAndSendLocation, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const getAndSendLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          id: id,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        };

        console.log('Sending location:', newLocation);
        if (socket) {
          socket.emit('locationUpdate', newLocation);
        }
        setLocation(newLocation);
        setError(null);
      },
      (err) => {
        setError(`Error: ${err.message}`);
        console.error(`Error: ${err.message}`);
      }
    );
  };

  return (
    <div>
      <h2>Delivery Boy {id}</h2>
      {location ? (
        <p>
          Current Location: Lat: {location.lat}, Lng: {location.lng}
        </p>
      ) : (
        <p>Getting location...</p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DeliveryBoy;