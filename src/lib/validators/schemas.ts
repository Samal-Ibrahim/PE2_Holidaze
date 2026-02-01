import { z } from "zod"

// Auth Schemas
export const LoginSchema = z.object({
	email: z
		.string()
		.email("Invalid email address")
		.refine((email) => email.endsWith("@stud.noroff.no"), {
			message: "Email must end with @stud.noroff.no",
		}),
	password: z.string().min(8, "Password must be at least 8 characters"),
})

export const RegisterSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z
		.string()
		.email("Invalid email address")
		.refine((email) => email.endsWith("@stud.noroff.no"), {
			message: "Email must end with @stud.noroff.no",
		}),
	password: z.string().min(8, "Password must be at least 8 characters"),
	confirmPassword: z.string(),
	avatar: z
		.string()
		.regex(/^https?:\/\/.+/, "Invalid avatar URL")
		.optional(),
	banner: z
		.string()
		.regex(/^https?:\/\/.+/, "Invalid banner URL")
		.optional(),
	venueManager: z.boolean().default(false),
})

export const LoginResponseSchema = z.object({
	data: z.object({
		id: z.string(),
		name: z.string(),
		email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
		accessToken: z.string(),
	}),
})

export const RegisterResponseSchema = z.object({
	data: z.object({
		id: z.string(),
		name: z.string(),
		email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
		avatar: z
			.string()
			.regex(/^https?:\/\/.+/, "Invalid URL")
			.optional(),
		banner: z
			.string()
			.regex(/^https?:\/\/.+/, "Invalid URL")
			.optional(),
		venueManager: z.boolean(),
	}),
})

// Profile Schemas
export const ProfileSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
	avatar: z
		.string()
		.regex(/^https?:\/\/.+/, "Invalid URL")
		.optional(),
	banner: z
		.string()
		.regex(/^https?:\/\/.+/, "Invalid URL")
		.optional(),
	venueManager: z.boolean(),
})

export const UpdateProfileSchema = z.object({
	name: z.string().min(1, "Name is required").optional(),
	avatar: z
		.string()
		.regex(/^https?:\/\/.+/, "Invalid avatar URL")
		.optional(),
	banner: z
		.string()
		.regex(/^https?:\/\/.+/, "Invalid banner URL")
		.optional(),
})

// Venue Schemas
export const VenueSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	media: z.array(
		z.object({ url: z.string().regex(/^https?:\/\/.+/, "Invalid URL"), alt: z.string() })
	),
	price: z.number().positive(),
	maxGuests: z.number().positive(),
	rating: z.number().min(0).max(5),
	created: z.string().datetime(),
	updated: z.string().datetime(),
})

export const CreateVenueSchema = z.object({
	name: z.string().min(1, "Venue name is required"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	media: z.array(
		z.object({ url: z.string().regex(/^https?:\/\/.+/, "Invalid URL"), alt: z.string() })
	),
	price: z.number().positive("Price must be greater than 0"),
	maxGuests: z.number().positive("Max guests must be greater than 0"),
	rating: z.number().min(0).max(5).optional().default(0),
})

// Type exports
export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>
export type Profile = z.infer<typeof ProfileSchema>
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>
export type Venue = z.infer<typeof VenueSchema>
export type CreateVenue = z.infer<typeof CreateVenueSchema>
