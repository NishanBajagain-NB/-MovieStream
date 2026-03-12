import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark-light rounded-lg p-8 border border-dark-lighter">
            <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
            
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6 text-gray-300">
                <p className="text-sm text-gray-400 mb-6">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
                
                <p className="text-lg leading-relaxed">
                  Welcome to MovieStream. These Terms of Service ("Terms") govern your use of our website and streaming platform. By accessing or using MovieStream, you agree to be bound by these Terms.
                </p>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                <p className="leading-relaxed">
                  By accessing and using MovieStream, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Description of Service</h2>
                <p className="leading-relaxed">
                  MovieStream is a free movie streaming platform that provides access to movies through embedded content from third-party sources. We aggregate and organize content that is freely available on the internet.
                </p>
                
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 my-6">
                  <p className="text-red-200 font-medium mb-2">Content Disclaimer:</p>
                  <p className="leading-relaxed">
                    <strong>All movies and video content on MovieStream are embedded from third-party sources and external servers.</strong> We do not host, store, upload, or own any video content on our servers. We simply provide links and embed codes that are publicly available on the internet. MovieStream acts as a search engine and content aggregator only.
                  </p>
                </div>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. User Responsibilities</h2>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>You must be at least 13 years old to use this service</li>
                  <li>You are responsible for your own internet connection and data usage</li>
                  <li>You agree not to use the service for any illegal or unauthorized purpose</li>
                  <li>You will not attempt to interfere with the proper functioning of the service</li>
                  <li>You will not use automated systems to access the service</li>
                </ul>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Prohibited Activities</h2>
                <p className="leading-relaxed mb-3">You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>Download, copy, or redistribute content from the platform</li>
                  <li>Use the service for commercial purposes without permission</li>
                  <li>Attempt to reverse engineer or hack the platform</li>
                  <li>Upload malicious code or viruses</li>
                  <li>Impersonate others or provide false information</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Intellectual Property</h2>
                <p className="leading-relaxed">
                  The MovieStream platform design, logo, and original content are protected by copyright and other intellectual property laws. All embedded content belongs to their respective owners and copyright holders. We respect intellectual property rights and will respond to valid DMCA takedown requests.
                </p>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Third-Party Content</h2>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="leading-relaxed">
                    Since all video content is embedded from third-party sources, we have no control over the availability, quality, or legality of such content. Users access third-party content at their own risk and discretion. We are not responsible for any issues arising from third-party content or services.
                  </p>
                </div>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Disclaimers</h2>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>The service is provided "as is" without warranties of any kind</li>
                  <li>We do not guarantee uninterrupted or error-free service</li>
                  <li>We are not responsible for content accuracy or availability</li>
                  <li>We do not warrant that the service will meet your requirements</li>
                </ul>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  MovieStream shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the service, even if we have been advised of the possibility of such damages.
                </p>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Privacy Policy</h2>
                <p className="leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
                </p>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. Modifications to Terms</h2>
                <p className="leading-relaxed">
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the service after changes constitutes acceptance of the new Terms.
                </p>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">11. Termination</h2>
                <p className="leading-relaxed">
                  We may terminate or suspend your access to the service immediately, without prior notice, for any reason, including breach of these Terms.
                </p>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">12. Governing Law</h2>
                <p className="leading-relaxed">
                  These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
                </p>
                
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-3">Contact Information</h3>
                  <p className="leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us through our available communication channels.
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

export default TermsPage;