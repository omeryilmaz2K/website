import { FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Hakkımızda</h3>
            <p>Kaliteli ürünler ve güvenilir hizmet anlayışımızla sizlere hizmet vermekteyiz.</p>
          </div>

          <div className="footer-section">
            <h3>Kategoriler</h3>
            <ul>
              <li>Filmler</li>
              <li>Diziler</li>
              <li>PS Oyunları</li>
              <li>Konsollar</li>
              <li>Xbox</li>
              <li>Oyuncaklar</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>İletişim</h3>
            <div className="contact-info">
              <p><FaPhone /> +90 XXX XXX XX XX</p>
              <p><FaWhatsapp /> WhatsApp Destek</p>
              <p><FaEnvelope /> info@example.com</p>
              <p><FaMapMarkerAlt /> Adres Bilgisi</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 E-Ticaret. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
