import { motion } from 'framer-motion';
import React from 'react';

const variants = {
  start: {
    opacity: 0,
    y: 10,
  },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      type: 'spring',
      damping: 10,
      stiffness: 100,
    },
  }),
};

const MotionFadeUp: React.FC<{ delay?: number }> = ({
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

export default MotionFadeUp;
