import React, { useRef, useEffect, useState } from 'react';
import "../styles/offerride.css";
import formBg from "../assets/gmap_bg.jpg";

const OfferRide = ({ apiKey }) => {
  const mapRef = useRef();
  const sourceInputRef = useRef();
  const destinationInputRef = useRef();
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey]);

  useEffect(() => {
    if (directionsService && source && destination) {
      calculateAndDisplayRoute();
    }
  }, [directionsService, source, destination]);

  const initMap = () => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 28.6312, lng: 77.3709 },
      zoom: 15,
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    setDirectionsService(directionsService);
    setDirectionsRenderer(directionsRenderer);

    // Initialize autocomplete for source and destination input fields
    const sourceAutocomplete = new window.google.maps.places.Autocomplete(
      sourceInputRef.current
    );
    const destinationAutocomplete = new window.google.maps.places.Autocomplete(
      destinationInputRef.current
    );

    sourceAutocomplete.addListener('place_changed', () => {
      const place = sourceAutocomplete.getPlace();
      if (!place.geometry) {
        console.log('Place not found');
        return;
      }
      setSource(place.formatted_address);
    });

    destinationAutocomplete.addListener('place_changed', () => {
      const place = destinationAutocomplete.getPlace();
      if (!place.geometry) {
        console.log('Place not found');
        return;
      }
      setDestination(place.formatted_address);
    });
  };

  const calculateAndDisplayRoute = () => {
    directionsService.route(
      {
        origin: source,
        destination: destination,
        travelMode: 'DRIVING',
      },
      (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  };

  return (
    <div className='outer'>
      <br />
      <br />
      <h1 className='topHeading'>"Offer Your Ride"</h1>
      <div className='inputForm'>
        <div className='formLine line1'>

          <div className="firstObj">
            <div className='icon'><i class="fa-solid fa-map-pin"></i></div>
            <input
              type="text"
              placeholder="Enter source" className='ip'
              ref={sourceInputRef}
            />
          </div>

          <div className='firstObj'>
          <div className='icon'><i class="fa-solid fa-car"></i></div>
            <input type="text" name="carname" id="car" className='ip' placeholder='Enter Car Name' />
          </div>

          <div className='firstObj'>
            <div className='icon'><i class="fa-solid fa-clock"></i></div>
            <input type="time" name="time" id="time" className='ip' />
          </div>

        </div>

        <div className='formLine line2'>
          
        <div className="secondObj">
            <div className='icon'><i class="fa-solid fa-location-arrow"></i></div>
            <input
              type="text"
              placeholder="Enter destination" className='ip'
              ref={destinationInputRef}
            />
          </div>

          <div className='secondObj'>
          <div className='icon'><i class="fa-solid fa-rug"></i></div>
          <input type="text" name="carnumber" id="carnumber" className='ip' placeholder='Enter Car Number'/>
          </div>

          <div className='secondObj'>
            <div className='icon'><i class="fa-solid fa-person"></i></div>
            <select id="seats" name="seats" className='dropdown ip'>
              <option value="1" className='ip'>1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4" selected>4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>
        </div>


        <div>
          {/* <button onClick={calculateAndDisplayRoute} className='submitBtn'>Offer Ride</button> */}
        </div>

      </div>
    
      <div style={{ height: '80vh', width: '80%', border: '5px', borderRadius: '50px', marginLeft:'9.5rem' }} ref={mapRef}></div>
    </div>
  );
};

export default OfferRide;
