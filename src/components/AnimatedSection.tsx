import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

type Variant = "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scaleIn";

const variants: Record<Variant, { hidden: object; visible: object }> = {
  fadeUp: {
    hidden: { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
};

interface Props {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export default function AnimatedSection({
  children,
  className = "",
  variant = "fadeUp",
  delay = 0,
  duration = 0.7,
  once = true,
}: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-80px" });
  const v = variants[variant];

  return (
    <motion.div
      ref={ref}
      initial={v.hidden}
      animate={isInView ? v.visible : v.hidden}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
