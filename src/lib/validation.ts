import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name').max(80),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number (starts with 6-9)'),
  addressLine1: z.string().min(5, 'Please enter house/flat number and street name').max(120),
  addressLine2: z.string().max(120).optional(),
  city: z.string().min(2, 'City is required').max(50),
  state: z.string().min(2, 'State is required').max(50),
  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit Indian postal pincode'),
  country: z.string().default('India'),
});

export type AddressFormData = z.infer<typeof addressSchema>;

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address to receive wellness dispatches'),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required').max(60),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(3, 'Subject is required').max(100),
  category: z.enum(['Product Advice', 'Order Support', 'Wholesale Inquiry', 'Formulation Feedback']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const pincodeLookupSchema = z.string().regex(/^[1-9][0-9]{5}$/, 'Enter 6-digit pincode');
