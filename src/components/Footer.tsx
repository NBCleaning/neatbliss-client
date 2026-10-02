import { Link } from "react-router-dom";
import { useConfig } from "../config/ConfigProvider";
import { resolveHomeContent } from "../config/homeContent";
import { telHref } from "../lib/phone";
import styles from "./Footer.module.css";

export function Footer() {
  const { config } = useConfig();
  const { business } = config;
  const { footerBlurb } = resolveHomeContent(config);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <div className={styles.brandRow}>
            <img
              src={`${import.meta.env.BASE_URL}logo.webp`}
              alt=""
              className={styles.brandLogo}
              width="44"
              height="40"
            />
            <span className={styles.brandName}>NeatBliss</span>
          </div>
          <p className={styles.blurb}>{footerBlurb}</p>
          <a
            href="https://www.bbb.org/us/mt/conrad/profile/house-cleaning/neatbliss-cleaning-llc-1296-1000194176/#sealclick"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className={styles.bbbSeal}
          >
            <img
              src="https://seal-alaskaoregonwesternwashington.bbb.org/seals/blue-seal-120-61-bbb-1000194176.png"
              alt="NeatBliss Cleaning LLC BBB Business Review"
              width="120"
              height="61"
            />
          </a>
        </div>

        <div className={styles.col}>
          <h3 className={styles.colHeading}>PAGES</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/#testimonials">Testimonials</Link>
            </li>
            <li>
              <Link to="/quote">Contact</Link>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h3 className={styles.colHeading}>CONTACT</h3>
          <ul>
            <li>
              <a href={telHref(business.phone)}>{business.phone}</a>
            </li>
            <li>
              <a href={`mailto:${business.email.trim()}`}>{business.email}</a>
            </li>
            <li>
              <a href={business.facebookUrl} target="_blank" rel="noreferrer">
                Facebook page
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>&copy; 2026 NeatBliss Cleaning. All rights reserved.</span>
        <span>neatblisscleaning.com</span>
      </div>
    </footer>
  );
}
