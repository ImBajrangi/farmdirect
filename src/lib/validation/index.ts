import { z } from 'zod';

export const phoneRegex = /^[6-9]\d{9}$/;
export const pincodeRegex = /^\d{6}$/;

export const loginSchema = z.object({
  phoneOrEmail: z.string().min(3, 'Phone or email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(phoneRegex, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  role: z.enum(['customer', 'farmer']),
  preferredLanguage: z.enum(['en', 'hi']).default('en'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const addressSchema = z.object({
  label: z.string().default('Home'),
  recipientName: z.string().min(2, 'Recipient name is required'),
  phone: z.string().regex(phoneRegex, 'Enter a valid 10-digit Indian mobile number'),
  addressLine1: z.string().min(5, 'Street address is required'),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, 'City/Town is required'),
  district: z.string().min(2, 'District is required'),
  state: z.string().default('Maharashtra'),
  pincode: z.string().regex(pincodeRegex, 'Enter a valid 6-digit pincode'),
  serviceAreaId: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export const productFormSchema = z.object({
  name: z.string().min(2, 'Product name in English is required'),
  nameHi: z.string().min(2, 'Product name in Hindi is required'),
  categoryId: z.string().min(1, 'Please select a category'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  descriptionHi: z.string().optional(),
  priceRupees: z.number().min(1, 'Price must be at least ₹1'),
  unit: z.enum(['kg', 'gram', 'piece', 'dozen', 'quintal', 'crate']),
  unitStep: z.number().min(0.1, 'Step must be at least 0.1').default(1),
  minOrderQuantity: z.number().min(0.5, 'Minimum order quantity required').default(1),
  maxOrderQuantity: z.number().optional(),
  availableQuantity: z.number().min(0, 'Available stock cannot be negative'),
  shelfLifeDays: z.number().min(1).optional(),
  imageUrl: z.string().url('Valid image URL required'),
  isCertifiedOrganic: z.boolean().default(false),
});

export const farmerOnboardingSchema = z.object({
  farmName: z.string().min(3, 'Farm/Business name is required'),
  farmNameHi: z.string().optional(),
  village: z.string().min(2, 'Village is required'),
  talukaOrTehsil: z.string().min(2, 'Taluka / Tehsil is required'),
  district: z.string().min(2, 'District is required'),
  state: z.string().default('Maharashtra'),
  pincode: z.string().regex(pincodeRegex, 'Enter a valid 6-digit pincode'),
  landAreaAcres: z.number().min(0.1, 'Land area in acres is required'),
  idProofType: z.enum(['aadhaar', 'kisan_credit_card', 'land_7_12']),
  idProofNumber: z.string().min(4, 'ID proof number or reference is required'),
  story: z.string().min(20, 'Please write a brief story about your farming practice'),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'Review comment must be at least 5 characters'),
});
