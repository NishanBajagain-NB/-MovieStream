import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark-light rounded-lg p-8 border border-dark-lighter">
            <h1 className="text-4xl font-bold text-white mb-8">About MovieStream</h1>
            
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6 text-gray-300">
                <p className="text-lg leading-relaxed">
                  Welcome to MovieStream, your ultimate destination for free movie streaming. We are passionate about bringing you the best entertainment experience with a vast collection of movies from various genres and eras.
                </p>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Our Mission</h2>
                <p className="leading-relaxed">
                  Our mission is to provide easy access to quality entertainment for movie enthusiasts worldwide. We believe that great stories should be accessible to everyone, regardless of their location or budget constraints.
                </p>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">What We Offer</h2>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>Extensive collection of movies across all genres</li>
                  <li>High-quality streaming experience</li>
                  <li>User-friendly interface with advanced search functionality</li>
                  <li>Regular updates with the latest releases</li>
                  <li>Mobile-responsive design for viewing on any device</li>
                  <li>No registration required for basic viewing</li>
                </ul>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Content Disclaimer</h2>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="text-yellow-200 font-medium mb-2">Important Notice:</p>
                  <p className="leading-relaxed">
                    All movies and content available on MovieStream are embedded from third-party sources and external servers. We do not host, store, or upload any video content on our own servers. We simply provide links and embed codes that are freely available on the internet.
                  </p>
                </div>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Our Commitment</h2>
                <p className="leading-relaxed">
                  We are committed to providing a safe and enjoyable streaming experience. Our platform is designed with user experience in mind, featuring intuitive navigation, fast loading times, and minimal advertisements to ensure uninterrupted viewing.
                </p>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Technology</h2>
                <p className="leading-relaxed">
                  MovieStream is built using modern web technologies to ensure optimal performance across all devices. Our responsive design adapts to smartphones, tablets, and desktop computers, providing a seamless experience regardless of how you choose to watch.
                </p>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Community</h2>
                <p className="leading-relaxed">
                  We value our community of movie lovers and continuously work to improve our platform based on user feedback. Your viewing preferences and suggestions help us curate better content and enhance the overall experience.
                </p>
                
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-3">Contact Us</h3>
                  <p className="leading-relaxed">
                    Have questions, suggestions, or feedback? We'd love to hear from you. Reach out to us through our contact channels, and we'll get back to you as soon as possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;