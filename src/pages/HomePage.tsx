import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Compass, BrainCircuit, Layers, ArrowRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Building2 className="h-6 w-6 text-primary-600" />,
      title: 'Intelligent Floor Plans',
      description: 'Generate realistic and unique floor plans based on your input dimensions that optimize space usage.'
    },
    {
      icon: <Compass className="h-6 w-6 text-primary-600" />,
      title: 'Traditional Principles',
      description: 'Designs incorporate traditional architectural principles for harmony and positive energy flow.'
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-primary-600" />,
      title: 'AI-Powered Design',
      description: 'Our advanced AI suggests optimizations and alternative layouts based on your requirements.'
    },
    {
      icon: <Layers className="h-6 w-6 text-primary-600" />,
      title: 'Multi-floor Planning',
      description: 'Create complex multi-story plans with integrated stairwells and connected living spaces.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary-900 to-secondary-900 text-white overflow-hidden">
          <div 
            className="absolute inset-0 z-0 opacity-20"
            style={{
              backgroundImage: "url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translateY(${scrollY * 0.2}px)`
            }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
            <div className="md:w-2/3">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Design Your Dream Home with Intelligent Floor Plans
              </motion.h1>
              <motion.p 
                className="mt-6 text-xl text-gray-200 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Enter your dimensions and watch as Vaastu creates beautiful, functional floor plans
                optimized for your space. Our AI-powered tool helps you visualize your future home with realistic 3D models.
              </motion.p>
              <motion.div 
                className="mt-10 flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link to="/floor-plan-generator" className="btn btn-outline bg-white/10 hover:bg-white/20 text-white border-white/30 btn-lg">
                  Try Demo
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold text-gray-900">Intelligent Design Features</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                Our platform combines advanced technology with architectural principles to create optimal living spaces.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="card p-6 h-full flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="p-2 bg-primary-50 rounded-lg w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600 flex-grow">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold text-gray-900">How It Works</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                Creating your perfect floor plan is simple with our three-step process.
              </p>
            </div>

            <div className="mt-16 grid gap-10 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Enter Dimensions',
                  description: 'Input the width and length of your house in feet to get started.',
                  image: 'https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                },
                {
                  step: '02',
                  title: 'Generate Plans',
                  description: 'Our AI generates multiple unique floor plans based on your dimensions.',
                  image: 'https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                },
                {
                  step: '03',
                  title: 'Visualize in 3D',
                  description: 'Explore your floor plans in 3D and make adjustments as needed.',
                  image: 'https://images.pexels.com/photos/7937416/pexels-photo-7937416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden mb-6 h-48 relative">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex items-start">
                    <span className="text-4xl font-serif font-bold text-primary-600 opacity-50 mr-4">{step.step}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                      <p className="mt-2 text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-serif font-bold">Ready to design your dream home?</h2>
            <p className="mt-4 text-xl text-white/80 max-w-2xl mx-auto">
              Start generating intelligent floor plans today and bring your vision to life.
            </p>
            <div className="mt-10">
              <Link to="/register" className="btn bg-white text-primary-700 hover:bg-gray-100 focus:ring-white">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}