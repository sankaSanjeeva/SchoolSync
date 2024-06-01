import { Variants, motion } from 'framer-motion'
import { Children } from 'react'

const greet =
  'Join School Sync today and take your communication to the next level. Sign up now to start connecting with your peers, classmates, or teachers effortlessly. Let School Sync be your go-to platform for all your educational communication needs.'

const variants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

export default function Intro() {
  return (
    <>
      <motion.h1
        className="text-5xl font-semibold"
        variants={variants}
        initial="hidden"
        whileInView="show"
        transition={{ duration: 2 }}
      >
        School Sync
      </motion.h1>

      <motion.p
        className="text-center tracking-widest"
        initial="hidden"
        whileInView="show"
        transition={{ staggerChildren: 0.02 }}
      >
        {Children.map(Array.from(greet), (letter) => (
          <motion.span variants={variants} transition={{ duration: 0.5 }}>
            {letter}
          </motion.span>
        ))}
      </motion.p>
    </>
  )
}
