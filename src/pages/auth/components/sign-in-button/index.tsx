import { motion, AnimatePresence, AnimationProps } from 'framer-motion'
import { GoogleIcon, SpinnerIcon } from '@/assets/icons'
import { Button, ButtonProps } from '@/components/ui/button'

const animationProps: AnimationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 1 },
}

interface Props extends ButtonProps {
  loading: boolean
}

export default function SignInButton({ loading, ...rest }: Props) {
  return (
    <motion.div {...animationProps} transition={{ duration: 2, delay: 5 }}>
      <Button className="gap-5" disabled={loading} {...rest}>
        {loading ? (
          <AnimatePresence>
            <motion.span {...animationProps}>
              <SpinnerIcon className="animate-spin" />
            </motion.span>
          </AnimatePresence>
        ) : (
          <motion.span {...animationProps}>
            <GoogleIcon />
          </motion.span>
        )}
        <span>Sign in with Google</span>
      </Button>
    </motion.div>
  )
}
