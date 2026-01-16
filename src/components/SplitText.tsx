import { motion } from "framer-motion";

interface SplitTextProps {
    text: string;
    className?: string; // Expecting text-... classes here
}

const SplitText = ({ text, className = "" }: SplitTextProps) => {
    // Split text into characters
    const characters = text.split("");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 50, // Slide up effect
        },
    };

    return (
        <motion.div
            className={`inline-block border-red-500 overflow-hidden ${className}`} // overflow-hidden is key for the "reveal" look
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {characters.map((char, index) => (
                <motion.span variants={child} key={index} className="inline-block origin-bottom">
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default SplitText;
