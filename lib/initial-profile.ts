import { currentUser, redirectToSignIn } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { Profile } from "@prisma/client";

export const initialProfile = async (): Promise<Profile> => {
  const user = await currentUser();

  //Redirect to Sign In Screen if There's no User
  if (!user) {
    redirectToSignIn();
    throw new Error("User not authenticated.");
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!profile) {
    const newProfile = await db.profile.create({
      data: {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newProfile;
  }

  return profile;
};
