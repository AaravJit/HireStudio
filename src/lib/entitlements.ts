import { prisma } from '@/lib/db';

export const FREE_MONTHLY_LIMIT = 2;

export async function getUserSubscription(userId: string) {
  return prisma.subscription.findUnique({ where: { userId } });
}

export async function isProUser(userId: string) {
  const subscription = await getUserSubscription(userId);
  return subscription?.status === 'active' || subscription?.status === 'trialing';
}

export async function getMonthlyUsage(userId: string, date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return prisma.tailoredResume.count({
    where: {
      userId,
      createdAt: {
        gte: start,
        lt: end
      }
    }
  });
}

export async function assertCanGenerate(userId: string) {
  const isPro = await isProUser(userId);
  if (isPro) return;
  const usage = await getMonthlyUsage(userId);
  if (usage >= FREE_MONTHLY_LIMIT) {
    throw new Error('Free plan limit reached. Upgrade to Pro for unlimited resumes.');
  }
}

export async function assertCanExport(userId: string, type: 'pdf' | 'docx' | 'zip') {
  const isPro = await isProUser(userId);
  if (type === 'pdf') return;
  if (!isPro) {
    throw new Error('Upgrade to Pro to export DOCX or ZIP bundles.');
  }
}
