"use client";

import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CarAnimation() {
  const { scrollY } = useScroll();

  // Smooth scroll
  const smoothY = useSpring(scrollY, {
    stiffness: 40,
    damping: 20,
  });

  const [direction, setDirection] = useState<number>(1);
  const [lastY, setLastY] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = smoothY.on("change", (currentY: number) => {
      setDirection(currentY > lastY ? 1 : -1);
      setLastY(currentY);
    });
    return () => unsubscribe();
  }, [smoothY, lastY]);

  // >>> Transformations <<<
  const x = useTransform(smoothY, (y) => direction * (y / 8));
  const y = useTransform(smoothY, (y) => Math.sin(y / 80) * 15);

  return (
    <motion.div
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
      style={{ x, y }}
    >
      <motion.div
        animate={{ rotate: direction === 1 ? 0 : 180 }}
        transition={{ duration: 0.4 }}
      >
        <Image
          src="/images/car.png"
          width={120}
          height={60}
          alt="car"
          className="drop-shadow-xl"
        />
      </motion.div>
    </motion.div>
  );
}
