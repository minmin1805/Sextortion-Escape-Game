import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const blurInUpVariants = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0,
        staggerChildren: 0.03,
      },
    },
  },
  item: {
    hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        y: { duration: 0.3 },
        opacity: { duration: 0.4 },
        filter: { duration: 0.3 },
      },
    },
  },
};

/**
 * Build list of { start, end, className } for highlighted phrases in text.
 */
function getHighlightRanges(text, highlights) {
  const ranges = [];
  let searchFrom = 0;
  for (const { word, className } of highlights) {
    const idx = text.indexOf(word, searchFrom);
    if (idx !== -1) {
      ranges.push({ start: idx, end: idx + word.length, className });
      searchFrom = idx + word.length;
    }
  }
  return ranges;
}

function getClassNameForIndex(index, ranges) {
  for (const { start, end, className } of ranges) {
    if (index >= start && index < end) return className;
  }
  return null;
}

/**
 * Renders text with character-by-character animation and optional colored words.
 * @param {string} text - Full line of text
 * @param {Array<{ word: string, className: string }>} highlights - Words/phrases to color (in order of appearance)
 * @param {string} className - Base class for the wrapper (e.g. text-white text-4xl)
 */
export function AnimatedHighlightText({ text, highlights = [], className }) {
  const characters = text.split("");
  const ranges = getHighlightRanges(text, highlights);

  return (
    <motion.span
      className={cn("block whitespace-pre-wrap", className)}
      variants={blurInUpVariants.container}
      initial="hidden"
      animate="show"
    >
      {characters.map((char, i) => {
        const highlightClass = getClassNameForIndex(i, ranges);
        return (
          <motion.span
            key={`${i}-${char}`}
            variants={blurInUpVariants.item}
            className={cn(
              "inline-block whitespace-pre",
              highlightClass
            )}
          >
            {char}
          </motion.span>
        );
      })}
    </motion.span>
  );
}
