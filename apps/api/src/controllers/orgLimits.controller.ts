import prisma from "../prisma/client";

const MAX_FREE_BOARDS = 5;

export const incrementAvailableCount = async (orgId: string) => {
  const orgLimit = await prisma.orgLimit.findUnique({ where: { orgId } });

  if (orgLimit) {
    await prisma.orgLimit.update({
      where: { orgId },
      data: { count: orgLimit.count + 1 },
    });
  } else {
    await prisma.orgLimit.create({ data: { orgId, count: 1 } });
  }
};

export const decreaseAvailableCount = async (orgId: string) => {
  const orgLimit = await prisma.orgLimit.findUnique({ where: { orgId } });

  if (orgLimit) {
    await prisma.orgLimit.update({
      where: { orgId },
      data: { count: orgLimit.count > 0 ? orgLimit.count - 1 : 0 },
    });
  }
};

export const hasAvailableCount = async (orgId: string): Promise<boolean> => {
  const orgLimit = await prisma.orgLimit.findUnique({ where: { orgId } });
  return !orgLimit || orgLimit.count < MAX_FREE_BOARDS;
};

export const getAvailableCount = async (orgId: string): Promise<number> => {
  const orgLimit = await prisma.orgLimit.findUnique({ where: { orgId } });
  return orgLimit ? orgLimit.count : 0;
};
