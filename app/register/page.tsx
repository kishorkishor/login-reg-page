'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { UserPlus, Phone, Hash, User, Mail, AlertCircle, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { isValidBdPhone, requestOtp, verifyOtp } from '@/utils/otp';

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  otp?: string;
  terms?: boolean;
};

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const onSendOtp = async () => {
    setError(null);
    const phone = watch('phone');
    if (!isValidBdPhone(phone)) {
      setError('Enter a valid BD phone number (e.g., +8801XXXXXXXXX or 8801XXXXXXXXX).');
      return;
    }
    setLoading(true);
    const res = await requestOtp(phone);
    setLoading(false);
    if (res.ok) {
      setOtpSent(true);
      setCooldown(60);
    } else {
      setError(res.error || 'Failed to send OTP. Please try again.');
    }
  };

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    setLoading(true);
    try {
      const res = await verifyOtp(data.phone, data.otp || '');
      if (!res.ok) throw new Error(res.error || 'Invalid OTP');
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (e: any) {
      setError(e?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-brand-primary/5" />
        </div>
        
        <div className="relative z-10 w-full max-w-md px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="p-8 backdrop-blur-sm bg-white/95 shadow-large border-0">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-2xl mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-brand-secondary mb-2">
                Registration Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your account has been created. Redirecting to login...
              </p>
              <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </Card>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-red-600/5" />
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-brand-secondary mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">
              Join China Wholesale for seamless sourcing
            </p>
          </motion.div>

          {/* Phone-first Registration */}
          <motion.div variants={fadeInUp}>
            <Card className="p-8 backdrop-blur-sm bg-white/95 shadow-large border-0">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-800"
                >
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field (required) */}
                <div>
                  <label htmlFor="name" className="label label-required">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    {...register('name', {
                      required: 'Full name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' }
                    })}
                    type="text"
                    id="name"
                    placeholder="Enter your full name"
                    className={`input ${errors.name ? 'input-error' : ''}`}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name.message as string}
                    </motion.p>
                  )}
                </div>

                {/* Email Field (required) */}
                <div>
                  <label htmlFor="email" className="label label-required">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    type="email"
                    id="email"
                    placeholder="your.email@example.com"
                    className={`input ${errors.email ? 'input-error' : ''}`}
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email.message as string}
                    </motion.p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="label label-required">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    {...register('phone', {
                      required: 'Phone is required',
                      validate: (v) => isValidBdPhone(v) || 'Use +8801XXXXXXXXX or 8801XXXXXXXXX'
                    })}
                    type="tel"
                    id="phone"
                    placeholder="+8801XXXXXXXXX"
                    className={`input ${errors.phone ? 'input-error' : ''}`}
                  />
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone.message as string}
                    </motion.p>
                  )}
                </div>

                {/* Send OTP (before OTP step) */}
                {!otpSent && (
                  <Button
                    type="button"
                    size="lg"
                    fullWidth
                    loading={loading}
                    onClick={onSendOtp}
                    className="mt-2"
                  >
                    Send OTP
                  </Button>
                )}

                {/* OTP Field */}
                {otpSent && (
                  <div>
                    <label htmlFor="otp" className="label label-required">
                      <Hash className="w-4 h-4 inline mr-2" />
                      Enter OTP
                    </label>
                    <input
                      {...register('otp', { required: 'OTP is required', minLength: { value: 4, message: 'OTP must be at least 4 digits' } })}
                      type="text"
                      inputMode="numeric"
                      id="otp"
                      placeholder="123456"
                      className={`input ${errors.otp ? 'input-error' : ''}`}
                    />
                    {errors.otp && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600 flex items-center"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.otp.message as string}
                      </motion.p>
                    )}
                  </div>
                )}

                {/* Terms Checkbox */}
                <div>
                  <label className="flex items-start">
                    <input
                      {...register('terms', {
                        required: 'You must agree to the terms and conditions'
                      })}
                      type="checkbox"
                      className="mt-1 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="ml-3 text-sm text-gray-600">
                      I agree to the{' '}
                      <Link href="/terms" className="text-brand-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-brand-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.terms && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.terms.message}
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                {otpSent && (
                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={loading}
                    icon={<UserPlus className="w-5 h-5" />}
                    className="mt-8"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP & Create Account'}
                  </Button>
                )}

                {/* Resend OTP at bottom */}
                {otpSent && (
                  <Button
                    type="button"
                    size="lg"
                    fullWidth
                    loading={loading}
                    onClick={cooldown > 0 ? undefined : onSendOtp}
                    className="mt-4"
                  >
                    {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                  </Button>
                )}
              </form>
              {/* No OAuth buttons for now */}

              {/* Divider */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="text-brand-primary hover:text-brand-primary/80 font-medium transition-colors inline-flex items-center"
                  >
                    Sign in
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Security Notice */}
          <motion.div variants={fadeInUp} className="text-center">
            <p className="text-xs text-gray-500">
              🔒 Your information is protected with enterprise-grade security
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}