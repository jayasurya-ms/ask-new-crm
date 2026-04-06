import { motion } from "framer-motion";

export default function CarouselContainer({
  testimonials,
  testimonialIndex,
  getCarouselRotation,
  handleCarouselChange,
}) {
  return (
    <div
      className="flex-1 flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {testimonials.map((item, index) => {
          const position = getCarouselRotation(index);
          const isCenter = position === 0;
          const isLeft = position === -1;
          const isRight = position === 1;

          return (
            <motion.div
              key={index}
              initial={false}
              animate={{
                x: isCenter ? 0 : isLeft ? -380 : 380,
                z: isCenter ? 0 : -300,
                opacity: isCenter ? 1 : 0.35,
                scale: isCenter ? 1 : 0.75,
                rotateY: isCenter ? 0 : isLeft ? 30 : -30,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 28,
              }}
              className="
                absolute w-80 h-96 rounded-2xl overflow-hidden
                shadow-xl shadow-primary/20 cursor-pointer
              "
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => {
                if (isLeft) handleCarouselChange("left");
                if (isRight) handleCarouselChange("right");
              }}
            >
              <motion.img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                animate={{ scale: isCenter ? 1.05 : 1 }}
                transition={{ duration: 0.5 }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

