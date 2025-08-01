import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-5xl font-serif text-primary-600">404</span>
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn btn-primary inline-flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Return Home
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}