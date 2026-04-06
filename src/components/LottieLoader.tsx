import { motion } from 'motion/react';

interface LottieLoaderProps {
  message?: string;
  size?: number;
}

export default function LottieLoader({ message = 'Loading...', size = 180 }: LottieLoaderProps) {
  return (
    <div className="flex items-center justify-center min-h-screen gradient-bg-subtle">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center gap-2"
      >
        {/* @ts-expect-error dotlottie-player is a web component */}
        <dotlottie-player
          src="https://lottie.host/351c1f22-d755-4fed-b504-c891e0d22b76/B0vV62RAbe.lottie"
          background="transparent"
          speed="1"
          style={{ width: `${size}px`, height: `${size}px` }}
          loop
          autoplay
        />
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground font-medium mt-1"
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}
