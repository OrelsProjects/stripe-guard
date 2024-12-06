import {
  DotLottieReact,
  DotLottieReactProps,
} from "@lottiefiles/dotlottie-react";

export interface LottiePlayerProps extends DotLottieReactProps {
  hideAfterAnimation?: boolean;
}

export default function LottiePlayer({
  hideAfterAnimation,
  ...props
}: LottiePlayerProps) {
  return (
    <DotLottieReact
      {...props}
    />
  );
}
