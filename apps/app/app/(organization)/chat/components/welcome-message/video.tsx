import { configs } from '@/config';
import { StaggerContainer } from '@repo/design-system/components/ui/stagger-container';
import { motion } from 'framer-motion';

export const VideoAnimation = () => {
  return (
    <div className="relative inline-block">
      <StaggerContainer>
        <motion.div
          variants={{
            hidden: {
              rotate: 0,
              scale: 1,
            },
            visible: {
              rotate: -6,
              scale: 1.1,
            },
          }}
          initial="hidden"
          animate="visible"
          className="absolute h-[50px] w-[70px] cursor-pointer"
        >
          <video
            src={configs.heroVideo}
            autoPlay
            playsInline
            loop
            muted
            className="absolute top-0 left-0 h-full w-full rounded-md object-cover"
          />
        </motion.div>
      </StaggerContainer>
    </div>
  );
};
