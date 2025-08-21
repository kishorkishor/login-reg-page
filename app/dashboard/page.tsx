'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-red-600/5" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-10 text-center backdrop-blur-sm bg-white/95 shadow-large border-0">
            <h1 className="text-2xl font-bold text-brand-secondary mb-3">
              KISHOR SAYS U LOGGED IN
            </h1>
            <p className="text-gray-600 mb-8">Welcome to the demo dashboard page.</p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}


