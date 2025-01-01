import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';

export const AudioWaveSpinner = () => {
  const animationContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      animationContainer.current &&
      animationContainer?.current?.childNodes?.length === 0
    ) {
      const player = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/microphone.json',
      });
    }
  }, []);
  return (
    <div ref={animationContainer} className="h-10 w-10 overflow-hidden"></div>
  );
};
