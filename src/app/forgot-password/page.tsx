"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#007bff] p-12 flex-col text-white items-center text-center">
        <h1 className="text-3xl font-bold pb-0 animate-fade-in">Reset Your Password</h1>
        <div className="flex-grow flex items-center justify-center -mt-16 -mb-16">
          <Image
            src="/dashboardsmall.png"
            alt="Operity Dashboard Preview"
            width={600}
            height={400}
            className="rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-float"
          />
        </div>
        <p className="text-sm text-center max-w-2xl animate-fade-in-up">
          Don't worry! It happens. Please enter the email address associated with your account.
        </p>
      </div>

      {/* Right side - Reset Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 bg-white">
        <div className="w-full max-w-[400px] animate-fade-in-up">
          <div className="mb-8 text-center">
          <div className="flex items-center flex-1 justify-center mb-8">
            <Image
              src="/FreightLynkLogo.svg"
              alt="FreightLynk Logo"
              width={70}
              height={70}
              className="mr-2 animate-fade-in-up"
            />
          </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 animate-fade-in">Forgot Password?</h2>
            <p className="text-gray-600 animate-fade-in-up">Enter your email to reset your password.</p>
          </div>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up delay-400">
            <div>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition-all duration-300 text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#007bff] text-white py-2 rounded-lg hover:bg-[#0056b3] hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              Reset Password
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600 animate-fade-in-up delay-500">
            Remember your password?{" "}
            <Link href="/login" className="text-[#007bff] font-bold hover:text-[#0056b3] transition-colors duration-300">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}