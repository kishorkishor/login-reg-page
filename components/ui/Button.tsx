'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
  asChild?: boolean;
}

const getVariantStyles = (variant: ButtonVariant): string => {
  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-opacity-90 shadow-brand focus:ring-brand-primary',
    secondary: 'bg-brand-secondary text-white hover:bg-gray-800 focus:ring-brand-secondary',
    outline: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white focus:ring-brand-primary',
    ghost: 'text-brand-secondary hover:bg-brand-accent focus:ring-brand-secondary',
    link: 'text-brand-primary hover:text-opacity-80 underline-offset-4 hover:underline p-0 h-auto font-normal',
  } as const;
  return variants[variant];
};

const getSizeStyles = (size: ButtonSize): string => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-sm h-10',
    lg: 'px-6 py-3 text-base h-12',
    xl: 'px-8 py-4 text-lg h-14',
  } as const;
  return sizes[size];
};

const getIconSize = (size: ButtonSize): string => {
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  } as const;
  return iconSizes[size];
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      children,
      className,
      disabled,
      asChild,
      onClick,
      type = 'button',
      style,
      id,
      name,
      value,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center font-medium rounded-lg
      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden
    `;

    const buttonClasses = cn(
      baseStyles,
      getVariantStyles(variant),
      variant !== 'link' && getSizeStyles(size),
      fullWidth && 'w-full',
      className
    );

    const isDisabled = disabled || loading;
    const iconSize = getIconSize(size);

    const renderContent = () => {
      if (loading) {
        return (
          <>
            <Loader2 className={`${iconSize} animate-spin mr-2`} />
            {children}
          </>
        );
      }

      if (icon && iconPosition === 'left') {
        return (
          <>
            <span className={`${iconSize} mr-2 flex-shrink-0`}>
              {icon}
            </span>
            {children}
          </>
        );
      }

      if (icon && iconPosition === 'right') {
        return (
          <>
            {children}
            <span className={`${iconSize} ml-2 flex-shrink-0`}>
              {icon}
            </span>
          </>
        );
      }

      return children;
    };

    if (variant === 'link' && asChild) {
      return (
        <span className={buttonClasses} style={style} id={id}>
          {renderContent()}
        </span>
      );
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        className={buttonClasses}
        disabled={isDisabled}
        variants={buttonVariants}
        initial="initial"
        whileHover={!isDisabled ? "hover" : undefined}
        whileTap={!isDisabled ? "tap" : undefined}
        style={style}
        id={id}
        name={name}
        value={value}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {/* Ripple effect background */}
        {variant === 'primary' && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-lg"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Button content */}
        <span className="relative z-10 flex items-center">
          {renderContent()}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;