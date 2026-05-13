import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="relative z-10 py-20 px-6 md:px-12 border-t border-[var(--ps5-border)] bg-[var(--ps5-bg)]">
            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                {/* Brand */}
                <div className="flex items-center gap-4">
                    <Logo />
                </div>

                {/* Links */}
                <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
                    <a href="/jobs" className="hover:opacity-100 transition-opacity duration-300">Explore</a>
                    <a href="mailto:support@stunet.com" className="hover:opacity-100 transition-opacity duration-300">Contact</a>
                    <a href="#" className="hover:opacity-100 transition-opacity duration-300">Terms</a>
                </div>
            </div>

            {/* Bottom copyright */}
            <div className="max-w-[1600px] mx-auto mt-12 pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-20">
                    © {new Date().getFullYear()} STUNET. All systems operational.
                </p>
            </div>
        </footer>
    );
}
