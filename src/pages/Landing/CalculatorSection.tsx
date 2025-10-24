import { motion } from 'framer-motion';
import { TokenCalculator } from '@/components/TokenCalculator';

export const CalculatorSection = () => {
  return (
    <section id="calculator" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <TokenCalculator />
        </motion.div>
      </div>
    </section>
  );
};
