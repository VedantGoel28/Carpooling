import React from 'react'
import {loadStripe} from '@stripe/stripe-js';


function PaymentScreen() {
    
    const Rate = [{cost:25 , fname:"Rajat" , qnty:1}];
    const makePayment = async()=>
    {
        const stripe = await loadStripe('pk_test_51PAHO2SHVRpWe0M6ia9b4HZE4kYLWe60QHxMIBW0ft6a9oifxHNIjF2HyJFUcYC6bh8ogcRGnN6isloiLjFnNi3v00YQ2F2vtV');

        const body = {
            prices : Rate
        }

        const headers = {
            "Content-type": "application/json"
        }
        const response = await fetch("http://localhost:7000/api/create-checkout-session",{
            method:"POST",
            headers:headers,
            body:JSON.stringify(body)
        });

        const session = await response.json();

        const result = stripe.redirectToCheckout({
            sessionId:session.id
        });

        if(result.error)
        {
            console.log(result.error);
        }

    }
  return (
    <div>
            <input type="text" name="name" id="name" placeholder='Reciepent Name' className='ip'/>
            <button onClick={makePayment} className='submitBtn'>Make Payment</button>
    </div>
  )
}

export default PaymentScreen;