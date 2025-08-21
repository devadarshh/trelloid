import prisma from "../prisma/client";
const DAY_IN_MS = 86_400_000;

export const checkSubscription = async (orgId: string) => {
  if (!orgId) {
    return false;
  }

  const orgSubscription = await prisma.orgSubscription.findUnique({
    where: { orgId },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!orgSubscription) {
    return false;
  }

  const isValid =
    !!orgSubscription.stripePriceId &&
    orgSubscription.stripeCurrentPeriodEnd &&
    orgSubscription.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS > Date.now();

  return isValid;
};
