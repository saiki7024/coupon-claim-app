import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState("");
  const [coupon, setCoupon] = useState("");
  const guestID = localStorage.getItem("guest_id");
  
    const claimCoupon = async () => {
      try {
        const res = await fetch("http://coupon-claim-backend.onrender.com/claim-coupon", {
          method: "POST",
          credentials: "true",
          body: JSON.stringify({ guestID })
        });
        const data = await res.json();
  
        if (res.status === 429) {
          setMessage(data.message);
        } else {
          setCoupon(data.coupon);
          setMessage("You successfully claimed a coupon!");
        }

        if (!localStorage.getItem("guest_id")) {
          localStorage.setItem("guest_id", Date.now().toString()); // Unique ID based on time
      }
      
      } catch (error) {
        setMessage("Something went wrong.");
      }
    };

  return (
    <>
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Claim Your Coupon</h1>
      <button onClick={claimCoupon} className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md">
        Claim
      </button>
      {message && <p className="mt-4 text-red-500">{message}</p>}
      {coupon && <p className="mt-2 text-green-500">Coupon: {coupon}</p>}
    </div>
    </>
  )
}

export default App
