'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div className={["card", className].filter(Boolean).join(' ')} {...props}>
    {children}
  </div>
);

export default Card;


