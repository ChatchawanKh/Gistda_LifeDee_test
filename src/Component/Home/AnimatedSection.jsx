import React from 'react';
import { useInView } from './useInView';
import './animations.css';

const AnimatedSection = ({ children, delay = 'delay-1', className = '', ...props}) => {
  const [ref, inView] = useInView({ threshold: 0.15 });

  return (
    <div
      ref={ref}
      className={`${className} ${inView ? `animate-fade-in-up ${delay}` : 'pre-animate'}`} {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
