import { FaInstagram } from "react-icons/fa";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <span>Created by Mohamed Al Habsi</span>
      <a href="https://instagram.com/H4BSI" target="_blank" rel="noopener noreferrer" className="footer-insta">
        <FaInstagram size={14} />
        @H4BSI
      </a>
    </footer>
  );
}
