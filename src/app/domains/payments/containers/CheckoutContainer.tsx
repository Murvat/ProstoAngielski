// "use client";

// import { useState } from "react";
// import TitlePayment from "../components/TitlePayment";
// import CheckoutForm from "../components/CheckoutForm";
// import BenefitsPayment from "../components/BenefitsPayment";

// export default function CheckoutContainer() {
//   const [course, setCourse] = useState("");

//   return (
//     <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-200 p-6">
//       <div className="max-w-5xl w-full flex flex-col gap-8 md:gap-10 bg-white rounded-2xl shadow-lg p-6 md:p-10">
//         <TitlePayment />

//         <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
//           {/* Left: wider checkout form */}
//           <div className="flex-[2]">
//             <CheckoutForm course={course} setCourse={setCourse} />
//           </div>

//           {/* Right: narrower benefits */}
//           <div className="flex-[1]">
//             <BenefitsPayment />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
