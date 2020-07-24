import { motion } from 'framer-motion';
import React from 'react';

const variants = {
  start: {
    opacity: 0,
  },
  visible: (custom) => ({
    opacity: 1,
    transition: {
      delay: custom * 0.1,
      type: 'spring',
      stiffness: 10,
      duration: 1,
    },
  }),
};

const MotionFadeIn: React.FC<{ delay?: number }> = ({
  children,
  delay = 0,
}) => {
  return (
    <motion.div
      custom={delay}
      initial="start"
      animate="visible"
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default MotionFadeIn;
