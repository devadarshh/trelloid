import { clerkClient } from "@clerk/express";
import prisma from "../prisma";

export async function ensureUser(clerkUserId: string) {
  const existing = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (existing) return existing;

  const clerkUser = await clerkClient.users.getUser(clerkUserId);
  const email =
    clerkUser.emailAddresses.find(
      (address) => address.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    "";

  return prisma.user.upsert({
    where: { clerkId: clerkUserId },
    update: {
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      email: email.toLowerCase(),
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      clerkId: clerkUserId,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      email: email.toLowerCase(),
      imageUrl: clerkUser.imageUrl,
    },
  });
}
