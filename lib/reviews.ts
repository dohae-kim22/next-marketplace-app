import db from "./db";

export async function getReceivedReviews(userId: number) {
  return db.review.findMany({
    where: {
      revieweeId: userId,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      reviewer: {
        select: {
          userName: true,
          avatar: true,
        },
      },
      product: {
        select: {
          title: true,
          photo: true,
        },
      },
    },
  });
}
