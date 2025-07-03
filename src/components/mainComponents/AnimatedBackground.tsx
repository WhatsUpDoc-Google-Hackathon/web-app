import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Dot {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const AnimatedBackground = () => {
  const [dots, setDots] = useState<Dot[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Initialize dots
    const newDots: Dot[] = [];
    const numDots = 30;

    for (let i = 0; i < numDots; i++) {
      newDots.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
      });
    }

    setDots(newDots);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const animateDots = () => {
      setDots((prevDots) =>
        prevDots.map((dot) => {
          let { x, y, vx, vy } = dot;

          x += vx;
          y += vy;

          // Bounce off walls
          if (x <= 0 || x >= dimensions.width) vx *= -1;
          if (y <= 0 || y >= dimensions.height) vy *= -1;

          // Keep dots within bounds
          x = Math.max(0, Math.min(dimensions.width, x));
          y = Math.max(0, Math.min(dimensions.height, y));

          return { ...dot, x, y, vx, vy };
        })
      );
    };

    const interval = setInterval(animateDots, 30);
    return () => clearInterval(interval);
  }, [dimensions]);

  const getConnectedDots = () => {
    const connections: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      distance: number;
    }> = [];
    const maxDistance = 150;

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dot1 = dots[i];
        const dot2 = dots[j];

        if (!dot1 || !dot2) continue;

        const distance = Math.sqrt(
          Math.pow(dot1.x - dot2.x, 2) + Math.pow(dot1.y - dot2.y, 2)
        );

        if (distance < maxDistance) {
          connections.push({
            x1: dot1.x,
            y1: dot1.y,
            x2: dot2.x,
            y2: dot2.y,
            distance,
          });
        }
      }
    }

    return connections;
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Background gradient with stronger blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/40 via-white/60 to-blue-50/40 backdrop-blur-3xl" />

      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Large blurred shapes */}
        <motion.div
          className="absolute w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            x: [-100, 200, -100],
            y: [-100, 100, -100],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute right-0 top-1/3 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"
          animate={{
            x: [100, -150, 100],
            y: [50, -80, 50],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-72 h-72 bg-green-200/20 rounded-full blur-3xl"
          animate={{
            x: [-80, 120, -80],
            y: [80, -100, 80],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Dot network */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        {/* Connection lines */}
        {getConnectedDots().map((connection, index) => (
          <motion.line
            key={index}
            x1={connection.x1}
            y1={connection.y1}
            x2={connection.x2}
            y2={connection.y2}
            stroke="rgba(59, 130, 246, 0.25)"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{
              opacity: Math.max(0, 1 - connection.distance / 150) * 0.6,
            }}
            transition={{ duration: 0.1 }}
          />
        ))}

        {/* Dots */}
        {dots.map((dot) => (
          <motion.circle
            key={dot.id}
            cx={dot.x}
            cy={dot.y}
            r="2"
            fill="rgba(59, 130, 246, 0.7)"
            initial={{ scale: 0 }}
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: dot.id * 0.1,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default AnimatedBackground;
