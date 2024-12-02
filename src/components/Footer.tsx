import { Facebook, Twitter, Instagram, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900/50 border-t border-zinc-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">About Us</h3>
            <p className="text-gray-400">
              Discover the best in entertainment with our curated selection of movies and TV shows.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {[
                ['Movies', '/movies'],
                ['TV Shows', '/series'],
                ['My Watchlist', '/watchlist'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Legal</h3>
            <ul className="space-y-2">
              {[
                ['Terms of Service', '/terms'],
                ['Privacy Policy', '/privacy'],
                ['Cookie Policy', '/cookies'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Contact Us</h3>
            <div className="flex items-center gap-2 text-gray-400">
              <Mail className="w-4 h-4" />
              <a href="mailto:support@cinestream.com" className="hover:text-white transition-colors">
                support@cinestream.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MessageCircle className="w-4 h-4" />
              <span>Live Chat Support</span>
            </div>
            
            {/* Social Media */}
            <div className="flex gap-4 pt-4">
              {[
                [Facebook, 'https://facebook.com'],
                [Twitter, 'https://twitter.com'],
                [Instagram, 'https://instagram.com'],
              ].map(([Icon, url], index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} CineStream. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}