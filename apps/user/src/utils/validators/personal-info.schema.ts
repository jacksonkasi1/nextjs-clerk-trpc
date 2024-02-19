import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema, validateEmail } from '@/utils/validators/common-rules';

// form zod validation schema
export const personalInfoFormSchema = z.object({
  first_name: z.string().min(1, { message: messages.firstNameRequired }),
  last_name: z.string(),
  email: validateEmail,
  profile_pic: z.string().optional(),
  // avatar: fileSchema.optional(),
  // role: z.string().optional(),
  // country: z.string().optional(),
  // timezone: z.string().optional(),
  // bio: z.string().optional(),
  // portfolios: z.array(fileSchema).optional(),
});

// generate form types from zod validation schema
export type PersonalInfoFormTypes = z.infer<typeof personalInfoFormSchema>;

export const defaultValues = {
  first_name: undefined,
  last_name: undefined,
  email: undefined,
  profile_pic: undefined,
  // avatar: undefined,
  // role: undefined,
  // country: undefined,
  // timezone: undefined,
  // bio: undefined,
  // portfolios: undefined,
};
