'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { LogIn, Phone, Hash, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { isValidBdPhone, requestOtp, verifyOtp } from '@/utils/otp';

type LoginForm = {
  phone: string;
  otp?: string;
};

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<LoginForm>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const onVerifyOtp = async (data: LoginForm) => {
    setError(null);
    setLoading(true);
    try {
      const res = await verifyOtp(data.phone, data.otp || '');
      if (!res.ok) throw new Error(res.error || 'Invalid OTP');
      window.location.href = '/dashboard';
    } catch (e: any) {
      setError(e?.message || 'OTP verification failed');
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

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
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
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your China Wholesale account
            </p>
          </motion.div>

          {/* Phone OTP Login */}
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

              <form onSubmit={handleSubmit(onVerifyOtp)} className="space-y-6">
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

                {/* Send OTP (shown before OTP step) */}
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

                {/* OTP Field (after sent) */}
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

                {/* Verify Button */}
                {otpSent && (
                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={loading}
                    icon={<LogIn className="w-5 h-5" />}
                    className="mt-2"
                  >
                    {loading ? 'Verifying...' : 'Verify & Sign In'}
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

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    href="/register" 
                    className="text-brand-primary hover:text-brand-primary/80 font-medium transition-colors inline-flex items-center"
                  >
                    Create account
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div variants={fadeInUp} className="text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-brand-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-brand-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}