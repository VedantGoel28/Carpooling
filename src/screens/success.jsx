import React, { useRef, useEffect } from 'react';
import video from '../assets/mc_stan.mp4'

function Success() {
  // const videoRef = useRef(null);

  // useEffect(() => {
  //   const video = videoRef.current;

  //   const playPromise = video.play();

  //   if (playPromise !== undefined) {
  //     playPromise
  //       .then(_ => {
  //         // Autoplay started
  //       })
  //       .catch(error => {
  //         // Autoplay was prevented
  //         console.error('Autoplay was prevented');
  //         // You may choose to play the video on user interaction
  //       });
  //   }

  //   return () => {
  //     // Cleanup
  //     if (video) {
  //       video.pause();
  //     }
  //   };
  // }, []);

  return (
    <div style={{textAlign:'center', marginTop:'15rem'}}>
      <h1>Payment Succes : )</h1>
      {/* <video style={{margin:'3rem'}} ref={videoRef} width="640" height="360" controls autoPlay loop>
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
    </div>

  );
};
export default Success