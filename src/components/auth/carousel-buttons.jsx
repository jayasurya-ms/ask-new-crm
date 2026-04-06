import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function CarouselButtons({ handleCarouselChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="flex gap-3 justify-center mt-8"
    >
      {/* Left Button */}
      <motion.button
        onClick={() => handleCarouselChange("left")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="
          w-12 h-12 rounded-full
          bg-background
          border border-primary
          text-primary
          hover:bg-primary
          hover:text-primary-foreground
          transition-all
          flex items-center justify-center
        "
      >
        <ArrowLeft size={20} />
      </motion.button>

      {/* Right Button */}
      <motion.button
        onClick={() => handleCarouselChange("right")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="
          w-12 h-12 rounded-full
          bg-primary
          text-primary-foreground
          hover:bg-primary/90
          transition-all
          flex items-center justify-center
        "
      >
        <ArrowRight size={20} />
      </motion.button>
    </motion.div>
  );
}

