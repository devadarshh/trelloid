import { clerkClient } from "@clerk/express";
import prisma from "../prisma";

export async function ensureOrganization(orgId: string) {
  const existing = await prisma.organization.findUnique({
    where: { organizationId: orgId },
  });

  if (existing) return existing;

  const clerkOrg = await clerkClient.organizations.getOrganization({
    organizationId: orgId,
  });

  return prisma.organization.upsert({
    where: { organizationId: orgId },
    update: {
      name: clerkOrg.name,
      organizationImage: clerkOrg.imageUrl,
    },
    create: {
      organizationId: orgId,
      name: clerkOrg.name,
      organizationImage: clerkOrg.imageUrl,
    },
  });
}
