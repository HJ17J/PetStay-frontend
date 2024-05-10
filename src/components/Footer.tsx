import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/Footer.scss";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>{t("footer.title")}</h3>
        <p>{t("footer.address")}</p>
        <p>{t("footer.phone")}</p>
        <p>{t("footer.directions")}</p>
        <ul className="footer-links">
          <li>
            <a href="#!">{t("footer.terms")}</a>
          </li>
          <li>
            <a href="#!">{t("footer.privacyPolicy")}</a>
          </li>
        </ul>
      </div>
      <div className="footer-legal">
        <p>{t("footer.copyright")}</p>
      </div>
    </footer>
  );
};

export default Footer;
