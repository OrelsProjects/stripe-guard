import { CheckIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const averageTimeToCompleteColor = (averageTimeToComplete: number) => {
  if (averageTimeToComplete < 0.5) {
    return "#34d399";
  } else if (averageTimeToComplete >= 0.5 && averageTimeToComplete < 1) {
    return "#facc15";
  } else {
    return "#ef4444";
  }
};

export const averageTimeToCompleteExplanation = (
  averageTimeToComplete: number,
) => {
  if (averageTimeToComplete < 0.5) {
    return "All good!";
  } else if (averageTimeToComplete >= 0.5 && averageTimeToComplete < 1) {
    return "Something is slowing down your webhooks";
  } else {
    return "It takes more than 1 second to complete your webhooks. This is too slow.";
  }
};

// icon
export const averageTimeToCompleteIcon = (averageTimeToComplete: number) => {
  if (averageTimeToComplete < 0.5) {
    return CheckIcon;
  } else if (averageTimeToComplete >= 0.5 && averageTimeToComplete < 1) {
    return ExclamationTriangleIcon;
  } else {
    return ExclamationTriangleIcon;
  }
};
