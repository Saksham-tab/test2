import React, { useState } from 'react';
import { brandConfig } from '../../config/brand';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { contactFormSchema, ContactFormData } from '../../lib/validation';
import { Button } from '../../components/ui/Button';
import { Mail, Phone, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const ContactPage: React.FC = () => {
  const showToast = useUIStore((s) => s.showToast);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    category: 'Product Advice',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const validation = contactFormSchema.safeParse(formData);
    if (!validation.success) {
      const errMap: Record<string, string> = {};
      for (const err of validation.error.issues) {
        if (err.path[0]) {
          errMap[String(err.path[0])] = err.message;
        }
      }
      setFormErrors(errMap);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('Thank you! Your message has been received by our formulation team.');
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-10">
      <Breadcrumbs items={[{ label: 'Customer Care & Contact' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
          Customer Care Sanctuary
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#23201D]">
          We are here to support your ritual.
        </h1>
        <p className="text-xs text-[#635F59]">
          Reach out for personalized formulation guidance, order tracking assistance, or botanical inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Direct Contact Info */}
        <div className="lg:col-span-5 p-6 bg-[#FAF7F2] border border-[#E8E2D8] rounded-2xl space-y-6">
          <h2 className="font-serif text-2xl font-light text-[#23201D] pb-3 border-b border-[#E8E2D8]">
            Direct Channels
          </h2>

          <div className="space-y-4 text-xs text-[#635F59]">
            <div className="flex items-start gap-3">
              <Mail size={16} className="text-[#434D3D] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#23201D] block">Email Care</span>
                <a href={`mailto:${brandConfig.supportEmail}`} className="text-[#434D3D] hover:underline">
                  {brandConfig.supportEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={16} className="text-[#434D3D] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#23201D] block">Toll-Free Helpline</span>
                <span>{brandConfig.supportPhone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={16} className="text-[#434D3D] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#23201D] block">Operational Hours</span>
                <span>{brandConfig.supportHours}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[#434D3D] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#23201D] block">Formulation Sanctuary</span>
                <span>Sattva Botanical Lab, Solan, Himachal Pradesh 173212, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-[#F4EFEB] border border-[#D5CCC0] rounded-2xl">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 size={36} className="text-[#434D3D] mx-auto" />
              <h3 className="font-serif text-2xl font-medium text-[#23201D]">
                Message Received
              </h3>
              <p className="text-xs text-[#635F59] max-w-sm mx-auto">
                A member of our botanical customer care team will respond to your email within 24 business hours.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    category: 'Product Advice',
                    message: '',
                  });
                }}
              >
                Send Another Note
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-xl font-medium text-[#23201D] pb-2 border-b border-[#E8E2D8]">
                Send a Dispatch
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#23201D] mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#434D3D]"
                  />
                  {formErrors.name && <p className="text-[11px] text-[#A35843] mt-0.5">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#23201D] mb-1">Your Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#434D3D]"
                  />
                  {formErrors.email && <p className="text-[11px] text-[#A35843] mt-0.5">{formErrors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#23201D] mb-1">Topic *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ContactFormData['category'] })}
                    className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#434D3D]"
                  >
                    <option value="Product Advice">Product Advice &amp; Routine Pairing</option>
                    <option value="Order Support">Order Tracking &amp; Delivery</option>
                    <option value="Wholesale Inquiry">Wholesale &amp; Retail Circle</option>
                    <option value="Formulation Feedback">Botanical Formulation Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#23201D] mb-1">Subject *</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief summary..."
                    className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#434D3D]"
                  />
                  {formErrors.subject && <p className="text-[11px] text-[#A35843] mt-0.5">{formErrors.subject}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#23201D] mb-1">Message (at least 10 characters) *</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our formulation circle assist you today?"
                  className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded-md p-3 text-xs focus:outline-none focus:border-[#434D3D] resize-none"
                />
                {formErrors.message && <p className="text-[11px] text-[#A35843] mt-0.5">{formErrors.message}</p>}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
              >
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
