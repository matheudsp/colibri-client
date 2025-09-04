"use client";

// import Image from "next/image";
import { motion } from "framer-motion";

interface FormWrapperProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const FormWrapper = ({
  title,
  subtitle,
  children,
}: FormWrapperProps) => {
  return (
    <div className="min-h-svh w-full bg-background flex flex-col items-center justify-center pt-32 pb-10 px-4">
      {/* <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          width={200}
          height={200}
          src="/icons/logo-purple-black.svg"
          alt="Logo Colibri"
          priority
          className="w-auto h-20 mx-auto mb-6 mt-12"
        />
      </motion.div> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">{title}</h1>
          <p className="text-foreground/70 mt-2">{subtitle}</p>
        </div>
        {children}
      </motion.div>
    </div>
  );
};
