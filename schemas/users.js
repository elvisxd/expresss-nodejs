import z from 'zod'

const userSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  dob: z.string().transform((val) => new Date(val))
    .refine((val) => !isNaN(val.getTime()), {
      message: 'Invalid date format'
    }),
  gender: z.enum(['male', 'female']),
  isActive: z.boolean().optional(),
  roles: z.array(z.string()).default(['[user]']),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export function validateUser (input) {
  return userSchema.safeParse(input)
}

export function validatePartialUser (input) {
  return userSchema.partial().safeParse(input)
}
