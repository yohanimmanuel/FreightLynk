"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore, UserRole } from "@/store/authStore";

// Define user types
const userTypes = [
  "Freight Forwarder",
  "Exporter/Importer/Distributor",
  "Logistics Provider",
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Add proper type for errors
  interface FormErrors {
    [key: string]: string;
  }
  
  const [formData, setFormData] = useState({
    // Company Info
    companyName: "",
    companyAddress: "",
    companyWebsite: "",
    companySize: "",
    
    // User Type
    userType: "",
    otherUserType: "",
    
    // Business Operations
    businessOperations: "",
    goodsTypes: "",
    shippingFrequency: "",
    primaryRoutes: "",
    
    // Personal Info
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  
  // Add validation state
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Add type to validateStep parameter
  const validateStep = (currentStep: number) => {
    let stepErrors: FormErrors = {};
    let isValid = true;
    
    if (currentStep === 1) {
      // Validate Company Information
      if (!formData.companyName.trim()) {
        stepErrors.companyName = "Company name is required";
        isValid = false;
      }
      if (!formData.companyAddress.trim()) {
        stepErrors.companyAddress = "Company address is required";
        isValid = false;
      }
      if (!formData.companySize) {
        stepErrors.companySize = "Company size is required";
        isValid = false;
      }
    } else if (currentStep === 2) {
      // Validate User Type
      if (!formData.userType) {
        stepErrors.userType = "Please select a business type";
        isValid = false;
      }
      if (formData.userType === "Logistics Provider" && !formData.otherUserType.trim()) {
        stepErrors.otherUserType = "Please specify your business type";
        isValid = false;
      }
    } else if (currentStep === 3) {
      // Validate Business Operations
      if (!formData.businessOperations.trim()) {
        stepErrors.businessOperations = "Business operations description is required";
        isValid = false;
      }
      if (!formData.goodsTypes.trim()) {
        stepErrors.goodsTypes = "Types of goods is required";
        isValid = false;
      }
      if (!formData.shippingFrequency) {
        stepErrors.shippingFrequency = "Shipping frequency is required";
        isValid = false;
      }
      if (!formData.primaryRoutes.trim()) {
        stepErrors.primaryRoutes = "Primary shipping routes is required";
        isValid = false;
      }
    } else if (currentStep === 4) {
      // Validate Personal Information
      if (!formData.fullName.trim()) {
        stepErrors.fullName = "Full name is required";
        isValid = false;
      }
      if (!formData.jobTitle.trim()) {
        stepErrors.jobTitle = "Job title is required";
        isValid = false;
      }
      if (!formData.email.trim()) {
        stepErrors.email = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        stepErrors.email = "Please enter a valid email";
        isValid = false;
      }
      if (!formData.phone.trim()) {
        stepErrors.phone = "Phone number is required";
        isValid = false;
      }
      if (!formData.password) {
        stepErrors.password = "Password is required";
        isValid = false;
      } else if (formData.password.length < 8) {
        stepErrors.password = "Password must be at least 8 characters";
        isValid = false;
      }
      if (!formData.confirmPassword) {
        stepErrors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }
    
    setErrors(stepErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(step)) {
      setIsSubmitting(true);
      setError("");
      
      try {
        // Register user with auth store
        const success = await register(formData);
        
        if (success) {
          // Get user from store after registration
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
          setError("Registration failed. Please try again.");
        }
      } catch (err) {
        setError("An error occurred during registration");
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Helper function to display error message with proper type
  const ErrorMessage = ({ name }: { name: string }) => {
    return errors[name] ? (
      <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 animate-fade-in-up">
        <div className="flex items-center flex-1 justify-center mb-8">
          <Image
            src="/FreightLynkLogo.svg"
            alt="FreightLynk Logo"
            width={60}
            height={60}
            className="mr-2 animate-fade-in-up"
          />
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold text-gray-900 animate-fade-in-up">
          Create your account
        </h2>
        <p className="mt-1 text-center text-sm text-gray-600 animate-fade-in-up">
          Join FreightLynk. to streamline your freight operations
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4">
        <div className="flex justify-between items-center px-4 relative animate-fade-in-up">
          {/* Progress line */}
          <div className="absolute h-1 bg-gray-200 left-0 right-0 top-1/2 transform -translate-y-1/2 z-0"></div>
          <div 
            className={`absolute h-1 bg-[#007bff] left-0 right-0 top-1/2 transform -translate-y-1/2 z-0 transition-all duration-500 ease-in-out`} 
            style={{ width: `${(step-1) * 33.33}%` }}
          ></div>
          
          {/* Step circles */}
          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs z-10 
                         ${step >= 1 ? 'bg-[#007bff] text-white' : 'bg-gray-200 text-gray-700'} 
                         border-2 border-white transition-colors duration-500`}>1</div>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs z-10 
                         ${step >= 2 ? 'bg-[#007bff] text-white' : 'bg-gray-200 text-gray-700'} 
                         border-2 border-white transition-colors duration-500`}>2</div>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs z-10 
                         ${step >= 3 ? 'bg-[#007bff] text-white' : 'bg-gray-200 text-gray-700'} 
                         border-2 border-white transition-colors duration-500`}>3</div>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs z-10 
                         ${step >= 4 ? 'bg-[#007bff] text-white' : 'bg-gray-200 text-gray-700'} 
                         border-2 border-white transition-colors duration-500`}>4</div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Company Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 animate-fade-in">Company Information</h3>
                
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 animate-fade-in">
                    Company Name *
                  </label>
                  <div className="mt-1">
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.companyName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black animate-fade-in`}
                    />
                    <ErrorMessage name="companyName" />
                  </div>
                </div>

                <div>
                  <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 animate-fade-in">
                    Company Address *
                  </label>
                  <div className="mt-1">
                    <input
                      id="companyAddress"
                      name="companyAddress"
                      type="text"
                      required
                      value={formData.companyAddress}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.companyAddress ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black animate-fade-in`}
                    />
                    <ErrorMessage name="companyAddress" />
                  </div>
                </div>

                <div>
                  <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 animate-fade-in">
                    Company Website (optional)
                  </label>
                  <div className="mt-1">
                    <input
                      id="companyWebsite"
                      name="companyWebsite"
                      type="url"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black animate-fade-in"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 animate-fade-in">
                    Company Size *
                  </label>
                  <div className="mt-1">
                    <select
                      id="companySize"
                      name="companySize"
                      required
                      value={formData.companySize}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.companySize ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black animate-fade-in`}
                    >
                      <option value="">Select company size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501+">501+ employees</option>
                    </select>
                    <ErrorMessage name="companySize" />
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#007bff] hover:bg-[#0056d2] focus:outline-none focus:ring-2 focus:ring-offset-2 animate-fade-in"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: User Type */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 animate-fade-in">User Type</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 animate-fade-in">
                    Select your business type *
                  </label>
                  <div className="mt-2 space-y-2">
                    {userTypes.map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          id={type}
                          name="userType"
                          type="radio"
                          value={type}
                          checked={formData.userType === type}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 animate-fade-in"
                          required
                        />
                        <label htmlFor={type} className="ml-3 block text-sm font-medium text-gray-700 animate-fade-in">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.userType && (
                    <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.userType}</p>
                  )}
                </div>

                {formData.userType === "Logistics Provider" && (
                  <div>
                    <label htmlFor="otherUserType" className="block text-sm font-medium text-gray-700 animate-fade-in">
                      Please specify *
                    </label>
                    <div className="mt-1">
                      <input
                        id="otherUserType"
                        name="otherUserType"
                        type="text"
                        required
                        value={formData.otherUserType}
                        onChange={handleChange}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          errors.otherUserType ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black animate-fade-in`}
                      />
                      <ErrorMessage name="otherUserType" />
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-200 focus:outline-none animate-fade-in"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#007bff] hover:bg-[#0056d2] focus:outline-none focus:ring-2 focus:ring-offset-2 animate-fade-in"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Business Operations */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 animate-fade-in">Business Operations</h3>
                
                <div>
                  <label htmlFor="businessOperations" className="block text-sm font-medium text-gray-700 animate-fade-in">
                    Describe your business operations *
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="businessOperations"
                      name="businessOperations"
                      rows={2}
                      required
                      value={formData.businessOperations}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.businessOperations ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black animate-fade-in`}
                      placeholder="Brief description of your business operations"
                    />
                    <ErrorMessage name="businessOperations" />
                  </div>
                </div>

                <div>
                  <label htmlFor="goodsTypes" className="block text-sm font-medium text-gray-700 animate-fade-in">
                    Types of goods you typically ship *
                  </label>
                  <div className="mt-1">
                    <input
                      id="goodsTypes"
                      name="goodsTypes"
                      type="text"
                      required
                      value={formData.goodsTypes}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.goodsTypes ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black animate-fade-in`}
                      placeholder="e.g., Electronics, Textiles, Food products"
                    />
                    <ErrorMessage name="goodsTypes" />
                  </div>
                </div>

                <div>
                  <label htmlFor="shippingFrequency" className="block text-sm font-medium text-gray-700 animate-fade-in">
                    Shipping frequency *
                  </label>
                  <div className="mt-1">
                    <select
                      id="shippingFrequency"
                      name="shippingFrequency"
                      required
                      value={formData.shippingFrequency}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.shippingFrequency ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black animate-fade-in`}
                    >
                      <option value="">Select frequency</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Occasionally">Occasionally</option>
                    </select>
                    <ErrorMessage name="shippingFrequency" />
                  </div>
                </div>

                <div>
                  <label htmlFor="primaryRoutes" className="block text-sm font-medium text-gray-700 animate-fade-in">
                    Primary shipping routes/regions *
                  </label>
                  <div className="mt-1">
                    <input
                      id="primaryRoutes"
                      name="primaryRoutes"
                      type="text"
                      required
                      value={formData.primaryRoutes}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.primaryRoutes ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black animate-fade-in`}
                      placeholder="e.g., Asia to Europe, North America"
                    />
                    <ErrorMessage name="primaryRoutes" />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-200 focus:outline-none animate-fade-in"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#007bff] hover:bg-[#0056d2] focus:outline-none focus:ring-2 focus:ring-offset-2 animate-fade-in"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Personal Information */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 animate-fade-in">Personal Information</h3>
                
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 animate-fade-in">
                    Full Name *
                  </label>
                  <div className="mt-1">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.fullName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black animate-fade-in`}
                    />
                    <ErrorMessage name="fullName" />
                  </div>
                </div>

                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 animate-fade-in">
                    Job Title *
                  </label>
                  <div className="mt-1">
                    <input
                      id="jobTitle"
                      name="jobTitle"
                      type="text"
                      required
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.jobTitle ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black animate-fade-in`}
                    />
                    <ErrorMessage name="jobTitle" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 animate-fade-in">
                    Email address *
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black animate-fade-in`}
                    />
                    <ErrorMessage name="email" />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 animate-fade-in">
                    Phone Number *
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black animate-fade-in`}
                    />
                    <ErrorMessage name="phone" />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 animate-fade-in">
                    Password *
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black animate-fade-in`}
                    />
                    <ErrorMessage name="password" />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 animate-fade-in">
                    Confirm Password *
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black animate-fade-in`}
                    />
                    <ErrorMessage name="confirmPassword" />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-200 focus:outline-none animate-fade-in"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#007bff] hover:bg-[#0056d2] focus:outline-none focus:ring-2 focus:ring-offset-2 animate-fade-in"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 animate-fade-in-up"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 animate-fade-in-up">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => router.push("/login")}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-200 focus:outline-none animate-fade-in-up"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}