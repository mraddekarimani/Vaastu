import { Link } from 'react-router-dom';
import { Home, Mail, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-serif font-semibold">Vaastu</span>
            </div>
            <p className="mt-4 text-sm text-gray-300 max-w-md">
              Vaastu helps you create harmonious living spaces with intelligent floor plans
              that optimize space, airflow, and energy. Our AI-powered technology generates
              floor plans based on traditional architectural principles.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:contact@vaastu.com" className="text-gray-400 hover:text-white">
                <span className="sr-only">Email</span>
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Features</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/floor-plan-generator" className="text-sm text-gray-300 hover:text-white">
                  Floor Plan Generator
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  3D Visualization
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  AI Design Suggestions
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  Multi-floor Planning
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Vaastu. All rights reserved. Created by Manikanta Addekari.
          </p>
        </div>
      </div>
    </footer>
  );
}