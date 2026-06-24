import najmaLogo from "@/assets/najma.png";

const GOLD_FILTER =
  "brightness(0) saturate(100%) invert(45%) sepia(90%) saturate(700%) hue-rotate(340deg) brightness(115%)";
const WHITE_FILTER = "brightness(0) invert(1)";

interface SplitLogoProps {
  size?: string;
  alwaysGold?: boolean;
  scrolled?: boolean;
  className?: string;
}

export default function SplitLogo({ size = "w-20 h-20 sm:w-24 sm:h-24", alwaysGold = false, scrolled = false, className = "" }: SplitLogoProps) {
  const midGold = alwaysGold || scrolled;
  return (
    <div className={`relative shrink-0 ${size} ${className}`}>
      {/* Top half — always white */}
      <img src={najmaLogo} alt="" aria-hidden className="absolute inset-0 w-full h-full object-contain transition-all duration-500"
        style={{ clipPath: "inset(0 0 50% 0)", filter: WHITE_FILTER }} />
      {/* Bottom half — white or #F65E28 */}
      <img src={najmaLogo} alt="Najma Global logo" className="absolute inset-0 w-full h-full object-contain transition-all duration-500"
        style={{ clipPath: "inset(50% 0 0 0)", filter: midGold ? GOLD_FILTER : WHITE_FILTER }} />
    </div>
  );
}
