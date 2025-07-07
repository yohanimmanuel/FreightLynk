"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, UserRole } from "@/store/authStore";

export default function Login() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      
      if (success) {
        // Get user from store after login
        const user = useAuthStore.getState().user;
        
        // Redirect based on role
        if (user) {
          switch (user.role) {
            case UserRole.ADMIN:
              router.push('/admin');
              break;
            case UserRole.CLIENT:
              router.push('/client');
              break;
            case UserRole.FORWARDER:
              router.push('/forwarder');
              break;
            case UserRole.LOGISTICS_PROVIDER:
              router.push('/logisticsprovider');
              break;
            default:
              router.push('/');
          }
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#007bff] p-12 flex-col text-white items-center text-center">
        <h1 className="text-3xl font-bold pb-0 animate-fade-in">Seamless Freight. Smarter Operations.</h1>
        <div className="flex-grow flex items-center justify-center -mt-16 -mb-16">
          <Image
            src="/dashboardsmall.png"
            alt="Nexport Dashboard Preview"
            width={600}
            height={400}
            className="rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-float"
          />
        </div>
        <p className="text-sm text-center max-w-2xl animate-fade-in-up">
          FreightLynk. empowers your supply chain with tools for efficient booking, real-time
          tracking, and simplified trade documentation — all in one integrated system.
        </p>
      </div>

      {/* Right side - Login Form */}
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
            <h2 className="text-2xl font-bold mb-2 text-gray-900 animate-fade-in">Welcome Back!</h2>
            <p className="text-gray-600 animate-fade-in-up">Please enter your details to log in.</p>
          </div>

          {/* Social Login Buttons */}
          <div className="flex gap-4 mb-6 justify-center animate-fade-in-up delay-200">
            <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 hover:scale-110 transition-all duration-300">
              <Image src="/facebook.svg" alt="Facebook" width={24} height={24} />
            </button>
            <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 hover:scale-110 transition-all duration-300">
              <Image src="/google.svg" alt="Google" width={24} height={24} />
            </button>
            <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 hover:scale-110 transition-all duration-300">
              <Image src="/apple.svg" alt="Apple" width={24} height={24} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6 animate-fade-in-up delay-300">
            <div className="h-[1px] flex-grow bg-gray-200"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="h-[1px] flex-grow bg-gray-200"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up delay-400">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition-all duration-300 text-gray-900 placeholder:text-gray-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Hint: Use email prefixes for different roles: 
                <span className="font-semibold"> admin@</span>, 
                <span className="font-semibold"> forwarder@</span>, 
                <span className="font-semibold"> logistics@</span>, 
                or any other for client role
              </p>
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition-all duration-300 text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 group cursor-pointer select-none">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all duration-300 checked:border-[#007bff] checked:bg-[#007bff] hover:border-[#007bff] focus:outline-none"
                  />
                  <svg
                    className="pointer-events-none absolute h-3 w-3 opacity-0 transition-opacity duration-300 peer-checked:opacity-100"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-[#007bff]">
                  Remember Me
                </span>
              </label>
              <Link href="/forgot-password" className="text-sm text-[#007bff] hover:text-[#0056b3] transition-colors duration-300">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#007bff] text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-3 text-sm text-gray-600 animate-fade-in-up delay-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#007bff] font-bold hover:text-[#0056b3] transition-colors duration-300">
              Register Here!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}