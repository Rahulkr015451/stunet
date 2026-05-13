import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  /** Show the full logo with text. Defaults to true for navbar, false shows icon only. */
  variant?: "full" | "icon";
  /** Size preset */
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: { icon: 32, logo: { width: 120, height: 40 } },
  md: { icon: 40, logo: { width: 160, height: 52 } },
  lg: { icon: 56, logo: { width: 220, height: 72 } },
  xl: { icon: 72, logo: { width: 320, height: 104 } },
};

export default function Logo({ className = "", variant = "full", size = "md" }: LogoProps) {
  const dims = sizes[size];

  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      {variant === "icon" ? (
        /* Icon-only badge for compact contexts */
        <div
          className="relative flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(0,68,255,0.25)] group-hover:shadow-[0_0_30px_rgba(0,210,255,0.4)] transition-all duration-500"
          style={{ width: dims.icon, height: dims.icon }}
        >
          <Image
            src="/images/stunet-icon.png"
            alt="STUNET"
            width={dims.icon}
            height={dims.icon}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      ) : (
        /* Full logo with graduation cap + text */
        <div className="flex items-center gap-3">
          {/* Icon badge */}
          <div
            className="relative flex-shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(0,68,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,210,255,0.4)] transition-all duration-500"
            style={{ width: dims.icon, height: dims.icon }}
          >
            <Image
              src="/images/stunet-icon.png"
              alt=""
              width={dims.icon}
              height={dims.icon}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* Brand text */}
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline font-black tracking-tighter" style={{ fontSize: dims.icon * 0.55 }}>
              <span className="text-white">STU</span>
              <span className="text-cyan-400">NET</span>
            </div>
            {size !== "sm" && (
              <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/25 mt-0.5">
                Student Network
              </span>
            )}
          </div>
        </div>
      )}
    </Link>
  );
}
