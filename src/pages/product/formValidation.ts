import * as z from 'zod'

export const formSchema = z.object({
    mainCategory: z.string().min(1, 'Main category is required'),
    subCategory: z.string().min(1, 'Please select a sub category'),
    unitBuyingPrice: z.string().optional(),
    packBuyingPrice: z.string().optional(),
    productName: z.string().min(1, 'Product name is required'),
    country: z.string().min(1, 'Country is required'),
    mainRegion: z.string().min(1, { message: "Main region is required" }),
    region: z.string().min(1, { message: "Sub region is required" }),
    varietal: z.string().optional(),
    abv: z.string().min(1, 'ABV is required'),
    vintage: z.string().min(1, 'Vintage is required'),
    dryness: z.string().min(1, 'Dryness is required'),
    sizes: z.array(z.string()).min(1, 'At least one size is required'),
    description: z.string().optional(),
    rating: z.string().optional(),
    packSize: z.string().min(1, 'Pack size is required'),
    packPrice: z.string().min(1, 'Pack price is required'),
    packDiscount: z.string().optional(),
    unitPrice: z.string().min(1, 'Unit price is required'),
    unitDiscount: z.string().optional(),
    quantityOnHand: z.string().min(1, 'Quantity is required'),
    greatForGift: z.boolean().default(false),
    collectables: z.array(z.string()).optional(),  // Add this line
  })


