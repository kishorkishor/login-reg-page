'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Shield, ArrowRight, Star, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Enterprise-grade security for your peace of mind'
    },
    {
      icon: CheckCircle,
      title: 'Quick Access',
      description: 'Fast and seamless login experience'
    },
    {
      icon: Star,
      title: 'Trusted Platform',
      description: 'Join thousands of satisfied users'
    }
  ];

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-red-600/5" />
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-brand-primary/5 to-red-600/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 w-full max-w-4xl px-6">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="text-center space-y-12"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary/10 text-brand-primary rounded-3xl mb-8">
              <Shield className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-secondary mb-4">
              Welcome to{' '}
              <span className="text-gradient">
                China Wholesale
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Secure access to your sourcing and logistics dashboard. 
              Choose an option below to continue your journey.
            </p>
          </motion.div>

          {/* Action Cards */}
          <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="p-8 card-hover group cursor-pointer backdrop-blur-sm bg-white/95 border-0 shadow-large">
              <Link href="/login" className="block">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl mb-4 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                    <LogIn className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-brand-secondary group-hover:text-brand-primary transition-colors">
                    Sign In
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Access your existing account and dashboard
                  </p>
                  <div className="inline-flex items-center text-brand-primary font-medium text-sm">
                    Continue <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </Card>

            <Card className="p-8 card-hover group cursor-pointer backdrop-blur-sm bg-white/95 border-0 shadow-large">
              <Link href="/register" className="block">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl mb-4 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-brand-secondary group-hover:text-brand-primary transition-colors">
                    Create Account
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Join our platform and start sourcing today
                  </p>
                  <div className="inline-flex items-center text-brand-primary font-medium text-sm">
                    Get Started <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </Card>
          </motion.div>

          {/* Features */}
          <motion.div variants={fadeInUp} className="space-y-8">
            <h2 className="text-2xl font-semibold text-brand-secondary">
              Why Choose Our Platform?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="text-center space-y-3"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-brand-secondary">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div variants={fadeInUp} className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © 2024 China Wholesale. Trusted sourcing partner for Bangladesh businesses.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}