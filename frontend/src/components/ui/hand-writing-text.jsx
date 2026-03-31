import { motion } from "framer-motion";

function HandWrittenTitle({ title = "Hand Written", subtitle = "Optional subtitle" }) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] },
        opacity: { duration: 0.5 },
      },
    },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      {/* Oval is only around the title */}
      <div style={{ position: "relative", width: "100%", maxWidth: "760px", padding: "36px 40px" }}>
        {/* Animated oval */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <motion.svg
            width="100%"
            height="100%"
            viewBox="0 0 760 160"
            preserveAspectRatio="none"
            initial="hidden"
            animate="visible"
            style={{ width: "100%", height: "100%" }}
          >
            <motion.path
              d="M 700 18
                 C 750 18, 760 50, 758 80
                 C 756 120, 700 148, 580 153
                 C 460 158, 300 158, 180 154
                 C 80 150, 10 132, 3 100
                 C -4 68, 20 38, 80 24
                 C 150 10, 300 4, 450 4
                 C 580 4, 668 10, 700 18"
              fill="none"
              strokeWidth="4"
              stroke="var(--accent)"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={draw}
            />
          </motion.svg>
        </div>

        {/* Title text — sits inside the oval */}
        <motion.span
          style={{
            position: "relative",
            zIndex: 10,
            display: "block",
            textAlign: "center",
            fontSize: "inherit",
            fontFamily: "inherit",
            fontWeight: "inherit",
            color: "var(--text-h)",
            letterSpacing: "inherit",
            lineHeight: "inherit",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {title}
        </motion.span>
      </div>

      {/* Subtitle sits cleanly below, outside the oval container */}
      {subtitle && (
        <motion.span
          style={{
            display: "block",
            textAlign: "center",
            fontSize: "inherit",
            fontFamily: "inherit",
            fontWeight: "inherit",
            color: "var(--text-h)",
            letterSpacing: "inherit",
            lineHeight: "inherit",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {subtitle}
        </motion.span>
      )}
    </div>
  );
}

export { HandWrittenTitle };
