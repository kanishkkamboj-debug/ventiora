import React from 'react';
import { Navbar } from './Navbar';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { TrendingRail } from '../widgets/TrendingRail';
import { Link } from 'react-router-dom';

interface PageWrapperProps {
  children: React.ReactNode;
  showTrending?: boolean;
}

export function PageWrapper({ children, showTrending = false }: PageWrapperProps) {
  const pageVariants: Variants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md transition-colors duration-300">
      <Navbar />
      <main className="flex-grow px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full py-stack-lg">
        {showTrending ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <motion.div 
              className="md:col-span-8 space-y-6"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {children}
            </motion.div>
            <div className="md:col-span-4 hidden md:block space-y-6">
              <TrendingRail />
            </div>
          </div>
        ) : (
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {children}
          </motion.div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-inverse-surface w-full mt-auto border-t border-border dark:border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center py-stack-lg px-gutter max-w-container-max mx-auto">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img src="/logo.svg" alt="Ventiora" className="w-7 h-7" />
            <span className="font-headline-md text-headline-md font-bold text-on-surface dark:text-on-primary-fixed-variant">
              Ventiora
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-body-md text-body-md font-label-sm text-label-sm">
            <Link to="/guidelines" className="text-muted-text dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed-dim hover:underline transition-all opacity-80 hover:opacity-100">Guidelines</Link>
            <Link to="/privacy" className="text-muted-text dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed-dim hover:underline transition-all opacity-80 hover:opacity-100">Privacy</Link>
            <Link to="/terms" className="text-muted-text dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed-dim hover:underline transition-all opacity-80 hover:opacity-100">Terms</Link>
          </div>
          <div className="mt-4 md:mt-0 font-label-sm text-label-sm text-muted-text text-center md:text-right">
            Â© 2024 Ventiora. For students, by students.
          </div>
        </div>
      </footer>
    </div>
  );
}
