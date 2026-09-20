import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAIFriend } from './AIFriendContext';

const AIFriendButton = () => {
  const { open, toggle } = useAIFriend();
  

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        
        <motion.button
          onClick={toggle}
          aria-label="Open AI Friend chat"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, 8, 0],
          }}
          transition={{
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          className="
          fixed
          right-6
          bottom-6
          z-[9999]
          flex
          h-[68px]
          w-[68px]
          items-center
          justify-center
          rounded-full
          text-white
          "
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #ddd6fe 0%, #c4b5fd 25%, #a78bfa 55%, #7c3aed 85%, #5b21b6 100%)',
            boxShadow:
              '0 0 0 0 rgba(167,139,250,0.5), 0 12px 35px -6px rgba(124,58,237,0.5), inset 0 -3px 10px rgba(0,0,0,0.18), inset 0 2px 8px rgba(255,255,255,0.4)',
          }}
        >
          {/* Pulse ring */}
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ background: 'rgba(167,139,250,0.4)' }}
            animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          />
          {/* Second slower pulse */}
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ background: 'rgba(196,181,253,0.3)' }}
            animate={{ scale: [1, 1.8], opacity: [0.35, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
          />
          {/* Inner glow shine */}
          <span
            className="pointer-events-none absolute inset-[3px] rounded-full opacity-50"
            style={{ background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.65), transparent 55%)' }}
          />

          {/* Cute animated AI character */}
          <svg
            viewBox="0 0 80 80"
            className="relative h-11 w-11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left ear */}
            <motion.g
              animate={{ rotate: [-6, 6, -6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '22px 22px' }}
            >
              <ellipse cx="22" cy="18" rx="7" ry="10" fill="#c4b5fd" />
              <ellipse cx="22" cy="18" rx="4" ry="6" fill="#ddd6fe" />
            </motion.g>
            {/* Right ear */}
            <motion.g
              animate={{ rotate: [6, -6, 6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '58px 22px' }}
            >
              <ellipse cx="58" cy="18" rx="7" ry="10" fill="#c4b5fd" />
              <ellipse cx="58" cy="18" rx="4" ry="6" fill="#ddd6fe" />
            </motion.g>

            {/* Body/head */}
            <motion.g
              animate={{ scaleY: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '40px 45px' }}
            >
              <ellipse cx="40" cy="45" rx="26" ry="22" fill="#f5f3ff" />
              {/* soft shading */}
              <ellipse cx="40" cy="45" rx="26" ry="22" fill="url(#bodyGrad)" />
            </motion.g>

            {/* Left eye */}
            <motion.g
              animate={open ? {} : { scaleY: [1, 0.12, 1] }}
              transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 3.5 }}
              style={{ transformOrigin: '30px 40px' }}
            >
              <ellipse cx="30" cy="40" rx="6" ry="7" fill="#1e1b4b" />
              <circle cx="32" cy="37" r="2.5" fill="white" />
              <circle cx="28" cy="42" r="1.2" fill="white" opacity="0.5" />
            </motion.g>
            {/* Right eye */}
            <motion.g
              animate={open ? {} : { scaleY: [1, 0.12, 1] }}
              transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 3.5, delay: 0.05 }}
              style={{ transformOrigin: '50px 40px' }}
            >
              <ellipse cx="50" cy="40" rx="6" ry="7" fill="#1e1b4b" />
              <circle cx="52" cy="37" r="2.5" fill="white" />
              <circle cx="48" cy="42" r="1.2" fill="white" opacity="0.5" />
            </motion.g>

            {/* Cheeks */}
            <circle cx="22" cy="48" r="3.5" fill="#f9a8d4" opacity="0.65" />
            <circle cx="58" cy="48" r="3.5" fill="#f9a8d4" opacity="0.65" />

            {/* Mouth */}
            <motion.path
              d="M34 52 Q40 58 46 52"
              stroke="#1e1b4b"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              animate={{ d: ['M34 52 Q40 58 46 52', 'M34 53 Q40 59 46 53', 'M34 52 Q40 58 46 52'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Little heart above */}
            <motion.path
              d="M40 8 C38 6, 35 6, 35 9 C35 12, 40 16, 40 16 C40 16, 45 12, 45 9 C45 6, 42 6, 40 8"
              fill="#f9a8d4"
              animate={{ y: [0, -3, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Gradients */}
            <defs>
              <radialGradient id="bodyGrad" cx="40" cy="35" r="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#f5f3ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0.1" />
              </radialGradient>
            </defs>
          </svg>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="left" className="font-medium">
        Talk with your AI Friend 💜
      </TooltipContent>
    </Tooltip>
  );
};

export default AIFriendButton;