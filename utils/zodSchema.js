import z from 'zod';

export const teamRegistrationSchema = z.object({
    eventId: z.string(),
    teamName: z.string().min(3).max(80),
    topicName: z.string().min(3).max(200),
    topicDescription: z.string().min(3).max(500),
    teamLeader: z.object({
        name: z.string().min(3).max(80),
        department: z.string().min(2).max(50).optional(),
        year: z.string().min(1).max(4).optional(),
        githubLink: z.string().url().optional(),
    }),
    email: z.string().email().transform((val) => val.toLowerCase()),
    numberOfMembers: z.string(),
    teamMembers: z.array(z.object({
        name: z.string().min(3).max(80),
        department: z.string().min(2).max(50).optional(),
        year: z.string().min(1).max(4).optional(),
    })),
});

export const emailSchema = z.object({
    email: z.string().email().transform((val) => val.toLowerCase()),
});

export const createEventSchema = z.object({
    title: z.string().min(3).max(80),
    description: z.string().min(3).max(500),
    dates: z.object({
        startingDate: z.string(),
        endingDate: z.string(),
    }),
});