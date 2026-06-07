import Link from "next/link"
import { USALogo } from "@/components/common/usa-logo"
import { getCachedFooterShell } from "@/lib/cms-shell-cache"

const mainLinks = [
  { number: "01", label: "Home", href: "/" },
  { number: "02", label: "Services", href: "/services" },
  { number: "03", label: "Trades", href: "/our-trades" },
  { number: "04", label: "Our Works", href: "/samples" },
  { number: "05", label: "Prices", href: "/pricing" },
  { number: "06", label: "About", href: "/about" },
  { number: "07", label: "Blogs", href: "/blog" },
]

const sideLinks = [
  { label: "Contact", href: "/contact" },
  { label: "Get a Quote", href: "/contact" },
]

export async function Footer() {
  const { contactData, footerServices } = await getCachedFooterShell()
  const primaryPhone = contactData.phones[0] ?? "(716) 226-1302"
  const primaryEmail =
    contactData.emails[0] ?? "info@usaestimatingsolutions.com"
  const address = contactData.address || "Brooklyn, NY 11222, USA"

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="w-fit">
              <USALogo width={168} height={64} />
            </Link>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <p>{address}</p>
              <p>{primaryPhone}</p>
            </div>
            <a
              href={`mailto:${primaryEmail}`}
              className="text-sm text-foreground underline-offset-4 hover:underline"
            >
              {primaryEmail}
            </a>
            <Link
              href="/contact"
              className="mt-2 inline-flex w-fit rounded-full border border-white/35 px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-white hover:text-black"
            >
              Get a Quote
            </Link>
          </div>

          {/* Main Links - Column 1 */}
          <div className="flex flex-col gap-4">
            {mainLinks.slice(0, 3).map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 text-sm transition-colors hover:text-foreground"
              >
                <span className="text-muted-foreground">{link.number}</span>
                <span className="text-muted-foreground">{'--'}</span>
                <span className="font-medium text-foreground">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Main Links - Column 2 */}
          <div className="flex flex-col gap-4">
            {mainLinks.slice(3).map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 text-sm transition-colors hover:text-foreground"
              >
                <span className="text-muted-foreground">{link.number}</span>
                <span className="text-muted-foreground">{'--'}</span>
                <span className="font-medium text-foreground">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Side Links + Social */}
          <div className="flex flex-col gap-4">
            {sideLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
              >
                {link.label}
              </Link>
            ))}
            {footerServices.slice(0, 4).map((service) => (
              <Link
                key={service._id.toString()}
                href={service.path || `/${service.slug}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {service.name}
              </Link>
            ))}
            <div className="mt-4 flex items-center gap-4">
              {/* Facebook */}
              <a href="https://www.facebook.com/profile.php?id=61581919022279" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground transition-colors hover:text-foreground">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Pinterest */}
              <a href="https://www.pinterest.com/usaestimatingsolutions/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="text-muted-foreground transition-colors hover:text-foreground">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.999 5.367 18.635.001 12.018.001L12.017 0z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/usaestimatingsolutions/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground transition-colors hover:text-foreground">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <p className="text-xs text-muted-foreground italic">
            All rights reserved.{" "}
            <span className="not-italic font-medium text-foreground">KloudEdge Design Studio.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
