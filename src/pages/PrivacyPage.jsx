import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark-light rounded-lg p-8 border border-dark-lighter">
            <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
            
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6 text-gray-300">
                <p className="text-sm text-gray-400 mb-6">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
                
                <p className="text-lg leading-relaxed">
                  At MovieStream, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our streaming platform.
                </p>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Information We Collect</h2>
                
                <h3 className="text-xl font-medium text-white mt-6 mb-3">Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>IP address and general location information</li>
                  <li>Browser type and version</li>
                  <li>Device information (type, operating system)</li>
                  <li>Pages visited and time spent on our platform</li>
                  <li>Referring website information</li>
                </ul>
                
                <h3 className="text-xl font-medium text-white mt-6 mb-3">Information You Provide</h3>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>Search queries and viewing preferences</li>
                  <li>Feedback and communications with us</li>
                  <li>Any information you voluntarily provide</li>
                </ul>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>To provide and improve our streaming services</li>
                  <li>To personalize your viewing experience</li>
                  <li>To analyze usage patterns and optimize performance</li>
                  <li>To communicate with you about service updates</li>
                  <li>To ensure platform security and prevent abuse</li>
                </ul>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Third-Party Content</h2>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-blue-200 font-medium mb-2">Important Notice:</p>
                  <p className="leading-relaxed">
                    MovieStream embeds content from third-party sources and external servers. We do not control the privacy practices of these external sources. When you access embedded content, you may be subject to the privacy policies of those third-party providers.
                  </p>
                </div>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Cookies and Tracking</h2>
                <p className="leading-relaxed">
                  We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser preferences.
                </p>
                
                <h3 className="text-xl font-medium text-white mt-6 mb-3">Types of Cookies We Use</h3>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Data Security</h2>
                <p className="leading-relaxed">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.
                </p>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Data Sharing</h2>
                <p className="leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share aggregated, non-personally identifiable information for analytical purposes.
                </p>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Your Rights</h2>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate data</li>
                  <li>Deletion of your personal information</li>
                  <li>Opt-out of certain data processing activities</li>
                </ul>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Children's Privacy</h2>
                <p className="leading-relaxed">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
                
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Changes to This Policy</h2>
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-3">Contact Us</h3>
                  <p className="leading-relaxed">
                    If you have any questions about this Privacy Policy or our data practices, please contact us through our available communication channels.
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

export default PrivacyPage;