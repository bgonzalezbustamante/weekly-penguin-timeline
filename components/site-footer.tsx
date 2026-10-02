export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <a
          className="footer-license"
          href="https://bgonzalezbustamante.com"
          aria-label="Bastián González-Bustamante academic website"
        >
          <span className="cc-icon" aria-hidden="true">
            CC
          </span>
          <span>{new Date().getFullYear()} Dr. Bastián González-Bustamante</span>
        </a>
      </div>
    </footer>
  )
}
