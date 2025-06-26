"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function LandingPage() {
  const router = useRouter();
  // Create a ref for the product preview section
  const productPreviewRef = useRef<HTMLDivElement>(null);
  
  // Function to handle smooth scrolling
  const scrollToProductPreview = () => {
    productPreviewRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800"> {/* Added text-gray-800 for default text color */}
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto animate-fade-in">
        <div className="flex items-center">
            <Image
              src="/FreightLynkLogo.svg"
              alt="FreightLynk Logo"
              width={40}
              height={40}
              className="animate-fade-in-up"
            />
            <span className="hidden lg:block font-bold text-[#007bff] text-2xl ml-1 menu-text animate-fade-in-up">Hello</span>
          </div>        
        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex gap-15">
            <button className="text-black hover:text-[#007bff] transition-colors animate-fade-in-up">
              Home
            </button>
            <button className="text-black hover:text-[#007bff] transition-colors animate-fade-in-up">
              Features
            </button>
            <button className="text-black hover:text-[#007bff] transition-colors animate-fade-in-up">
              Pricing
            </button>
            <button className="text-black hover:text-[#007bff] transition-colors animate-fade-in-up">
              About
            </button>
            <button className="text-black hover:text-[#007bff] transition-colors animate-fade-in-up">
              Contact
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 text-[#007bff] hover:text-[#0056D2] animate-fade-in-up delay-200"
          >
            Log in
          </button>
          <button
            onClick={() => router.push("/register")}
            className="px-4 py-2 bg-[#007bff] text-white rounded-lg hover:bg-[#0056D2] transition-colors animate-fade-in-up delay-300"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up delay-200">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mt-25 mb-15 animate-fade-in-up delay-300">
            Powering Seamless <br/>Global Freight Operations
          </h1>
          <p className="text-lg text-gray-600 mb-15 max-w-2xl mx-auto animate-fade-in-up delay-400">
            Streamline your logistics with our comprehensive platform that connects shippers, 
            freight forwarders, and logistics providers worldwide.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/bookings")}
              className="px-6 py-3 bg-[#007bff] text-white rounded-lg hover:bg-[#0056D2] transition-colors animate-fade-in-up delay-500 focus:outline-none"
            >
              Book Now!
            </button>
            <button 
              onClick={scrollToProductPreview}
              className="px-6 py-3 border border-[#848484] text-black rounded-lg hover:bg-gray-200 transition-colors animate-fade-in-up delay-600 focus:outline-none"
            >
              See how it works
            </button>
          </div>
        </div>

        {/* Product Preview - Add ref here */}
        <div ref={productPreviewRef} className="mt-20 animate-fade-in-up delay-400">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 animate-fade-in-up delay-500">Our Product</h2>
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-3xl mx-auto">
            <Image
              src="/dashboardsmall.png"
              alt="Operity Dashboard"
              width={800}
              height={500}
              className="w-full animate-fade-in"
              priority
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 gap-12">
          <div className="text-center p-6 bg-gray-50 rounded-lg flex flex-col items-center animate-fade-in-up delay-200">
            <div className="mb-15 w-[650px] h-[420px] bg-white rounded-lg flex items-center justify-center shadow-md">
              <Image
                src="/booking1.png"
                alt="Booking Flow"
                width={600}
                height={300}
                className="object-contain animate-fade-in"
              />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Booking Flow</h3>
            <p className="text-gray-600">Streamlined booking process with real-time rates and schedules</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg flex flex-col items-center animate-fade-in-up delay-300">
            <div className="mb-15 w-[650px] h-[420px] bg-white rounded-lg flex items-center justify-center shadow-md">
              <Image
                src="/Livetracker.png"
                alt="Live Tracker"
                width={600}
                height={300}
                className="object-contain animate-fade-in"
              />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Live Tracker</h3>
            <p className="text-gray-600">Real-time shipment tracking and status updates</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg flex flex-col items-center animate-fade-in-up delay-400">
            <div className="mb-15 w-[650px] h-[420px] bg-white rounded-lg flex items-center justify-center shadow-md">
              <Image
                src="/Freightmanagement.png"
                alt="Freight Management"
                width={600}
                height={300}
                className="object-contain animate-fade-in"
              />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Freight Management</h3>
            <p className="text-gray-600">Comprehensive freight and logistics management tools</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg flex flex-col items-center animate-fade-in-up delay-500">
            <div className="mb-15 w-[650px] h-[420px] bg-white rounded-lg flex items-center justify-center shadow-md">
              <Image
                src="/customscompliance.png"
                alt="Customs Compliances"
                width={600}
                height={300}
                className="object-contain animate-fade-in"
              />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Customs Compliances</h3>
            <p className="text-gray-600">Online freight document submission connected with other freight parties</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg flex flex-col items-center animate-fade-in-up delay-600">
            <div className="mb-15 w-[650px] h-[420px] bg-white rounded-lg flex items-center justify-center shadow-md">
              <Image
                src="/partners.png"
                alt="partners"
                width={600}
                height={300}
                className="object-contain animate-fade-in"
              />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">B2B Freight Partners</h3>
            <p className="text-gray-600">Connect and form online partners with B2B freight parties</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#007bff] text-white text-center py-16 mt-20 px-6"> {/* Added padding */}
        <h2 className="text-3xl font-bold mb-4">Get Started with FreightLynk.</h2>
        {/* Added the subtitle from the image */}
        <p className="mb-6 text-lg max-w-xl mx-auto">Subscribe and find super attractive price quotes from us.</p>
        <button
          onClick={() => router.push("/register")}
          // Adjusted button style to match image (white border, blue text on blue bg doesn't match, assuming white button on blue bg)
          className="px-8 py-3 bg-white text-[#007bff] rounded-lg hover:bg-gray-200 transition-colors border border-white" // Added border based on image
        >
          Sign Up Now {/* Changed text from Sign Up Now */}
        </button>
      </div>

      {/* Footer Section */}
      <footer className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-7 gap-12 text-sm">
          {/* Logo & Description */}
          <div className="md:col-span-3">
            <div className="flex items-center mb-3">
              <Image
                src="/FreightLynkLogo.svg"
                alt="FreightLynk Logo"
                width={40}
                height={40}
                className="mr-1 animate-fade-in-up"
              />
              <span className="hidden lg:block font-bold text-[#007bff] text-xl menu-text animate-fade-in-up">FreightLynk.</span>
            </div>               
            <p className="text-gray-600 max-w-xs">
              Our vision is to build an integrated and connected living spaces.
            </p>
          </div>

          {/* Links - About */}
          <div>
            <h4 className="font-bold text-[#007bff] mb-4">About</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-[#007bff]">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#007bff]">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#007bff]">News & Blog</a></li>
            </ul>
          </div>

          {/* Links - Company */}
          <div>
            <h4 className="font-bold text-[#007bff] mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-[#007bff]">How We Work?</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#007bff]">Capital</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#007bff]">Security</a></li>
            </ul>
          </div>

          {/* Links - Support */}
          <div>
            <h4 className="font-bold text-[#007bff] mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-[#007bff]">FAQs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#007bff]">Support center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#007bff]">Contact Us</a></li>
            </ul>
          </div>

          {/* Links - Follow Us */}
          <div>
            <h4 className="font-bold text-[#007bff] mb-4">Follow us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-[#007bff]">
                <Image src="/facebook.svg" alt="Facebook" width={24} height={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#007bff]">
                <Image src="/google.svg" alt="Google" width={24} height={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; FreightLynk, Inc. All rights reserved</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#007bff]">Terms & Agreements</a>
            <a href="#" className="hover:text-[#007bff]">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}