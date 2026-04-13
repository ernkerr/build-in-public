import { Hash, Briefcase, MessageCircleMore } from "lucide-react";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  x: Hash,
  linkedin: Briefcase,
  threads: MessageCircleMore,
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
