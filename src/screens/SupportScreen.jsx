import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Sample FAQ Data
const faqs = [
  {
    id: 1,
    question: 'How do I book a service?',
    answer: 'You can book a service by browsing beauticians or services, selecting your desired service, choosing a date and time, and confirming your appointment.',
  },
  {
    id: 2,
    question: 'Can I reschedule or cancel an appointment?',
    answer: 'Yes, you can reschedule or cancel appointments through your "My Bookings" section. Please note that cancellation policies may apply.',
  },
  {
    id: 3,
    question: 'How do I contact my beautician?',
    answer: 'Once a booking is confirmed, you can contact your beautician directly through the chat feature in the app or via the contact details provided in your booking confirmation.',
  },
  {
    id: 4,
    question: 'What payment methods are accepted?',
    answer: 'We accept major credit and debit cards through our secure payment gateway (Stripe).',
  },
];

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-accent"
        onClick={() => setIsOpen(!isOpen)}
      >
        {faq.question}
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && <p className="mt-2 text-gray-600">{faq.answer}</p>}
    </div>
  );
};

const SupportScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormMessage('');
    setIsError(false);

    // Simulate API call for contact form submission
    console.log('Submitting support request:', { name, email, subject, message });

    setTimeout(() => {
      setLoading(false);
      if (Math.random() > 0.1) { // Simulate 90% success rate
        setFormMessage('Your message has been sent successfully! We will get back to you soon.');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setIsError(true);
        setFormMessage('Failed to send message. Please try again later.');
      }
    }, 2000);
  };

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-heading text-accent mb-6">Support & Help</h1>

      {/* FAQ Section */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-heading text-accent mb-4">Frequently Asked Questions</h2>
        <div>
          {faqs.map(faq => <FAQItem key={faq.id} faq={faq} />)}
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-heading text-accent mb-4">Contact Us</h2>
        {formMessage && (
          <p className={`p-3 rounded-lg mb-4 ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {formMessage}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <textarea placeholder="Your Message" value={message} onChange={(e) => setMessage(e.target.value)} rows="5" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
          <button type="submit" disabled={loading} className="w-full btn btn-primary disabled:opacity-50">
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </section>

      {/* Chat Support Button */}
      <div className="text-center mt-8">
        <button className="btn btn-secondary text-lg px-8 py-3">
          Live Chat Support (Offline)
        </button>
        <p className="text-sm text-gray-500 mt-2">Available Monday - Friday, 9 AM - 5 PM EST</p>
      </div>
    </div>
  );
};

export default SupportScreen;