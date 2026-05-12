import { Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-foreground text-background py-16 px-6 md:px-12 lg:px-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
        
        {/* Left */}
        <div className="flex flex-col items-start space-y-4">
          <span className="font-serif italic text-3xl text-secondary">
            Atelier Sève
          </span>
          <span className="font-sans text-sm text-muted-foreground">
            Via della Spiga 12, Milano
          </span>
        </div>

        {/* Center */}
        <div className="flex flex-col items-start md:items-center space-y-4">
          <ul className="flex flex-col space-y-3 font-sans text-sm uppercase tracking-widest text-muted-foreground text-left md:text-center">
            <li>
              <a href="#" className="hover:text-secondary transition-colors" data-testid="footer-link-about">Chi Siamo</a>
            </li>
            <li>
              <a href="#services" className="hover:text-secondary transition-colors" data-testid="footer-link-services">Trattamenti</a>
            </li>
            <li>
              <a href="#" className="hover:text-secondary transition-colors" data-testid="footer-link-contact">Contatti</a>
            </li>
            <li>
              <a href="#" className="hover:text-secondary transition-colors" data-testid="footer-link-privacy">Privacy</a>
            </li>
          </ul>
        </div>

        {/* Right */}
        <div className="flex flex-col items-start md:items-end space-y-4 font-sans text-sm text-muted-foreground">
          <a href="tel:+39029876543" className="hover:text-secondary transition-colors">
            +39 02 9876543
          </a>
          <a href="mailto:info@atelierseve.it" className="hover:text-secondary transition-colors">
            info@atelierseve.it
          </a>
          <div className="flex items-center space-x-6 mt-4">
            <a href="#" className="text-muted-foreground hover:text-secondary transition-colors" data-testid="footer-social-ig">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-secondary transition-colors" data-testid="footer-social-fb">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>

      <div className="border-t border-border/20 pt-8 flex items-center justify-center">
        <p className="font-sans text-xs uppercase tracking-widest text-muted">
          © 2025 Atelier Sève. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}
