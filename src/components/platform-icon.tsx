import { Hash, Briefcase, MessageCircleMore, Cloud } from "lucide-react";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  x: Hash,
  linkedin: Briefcase,
  threads: MessageCircleMore,
  bluesky: Cloud,
};

export function PlatformIcon({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  const Icon = icons[platform] ?? MessageCircleMore;
  return <Icon className={className} />;
}
