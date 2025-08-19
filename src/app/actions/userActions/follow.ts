'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { follow, user } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'

//Follow admin

export async function FollowAdminAction(adminId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session)
    return {
      status: false,
      message: 'You are not authorized, please login to continue',
    }

  try {
    // check if the user is a seller
    const [isSeller] = await db.select().from(user).where(eq(user.id, adminId))

    if (isSeller.role !== 'admin')
      return {
        status: false,
        message: 'User is not a seller, you can only follow a seller',
      }

    await db
      .insert(follow)
      .values({
        followerId: session.user.id,
        adminId: adminId,
      })
      .onConflictDoNothing()

    return {
      status: true,
      message: `You are now following ${isSeller.name}`,
    }
  } catch (error) {
    console.log(error)

    return {
      status: false,
      message: 'Error occured while following admin',
    }
  }
}

//Unfollow admin
export async function UnFollowAdminAction(adminId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session)
    return {
      status: false,
      message: 'You are not authorized, please login to continue',
    }

  try {
    // check if the user is a seller
    const [isSeller] = await db.select().from(user).where(eq(user.id, adminId))

    if (isSeller.role !== 'admin')
      return {
        status: false,
        message: 'User is not a seller, you can only unfollow a seller',
      }

    await db
      .delete(follow)
      .where(and(eq(follow.adminId, adminId), eq(follow.followerId, session.user.id)))

    return {
      status: true,
      messaging: `Unfollowing ${isSeller.name}`,
    }
  } catch (error) {
    console.log(error)

    return {
      status: false,
      message: 'Error occured while unfollowing admin',
    }
  }
}

//Admin follwers
export async function GetAdminFollowers(adminId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session)
    return {
      status: false,
      message: 'You are not authorized, please login to continue',
    }

  try {
    // check if the user is a seller
    const [isSeller] = await db.select().from(user).where(eq(user.id, adminId))

    if (isSeller.role !== 'admin')
      return {
        status: false,
        message: 'User is not a seller, you are not authorized',
      }

    const followers = await db
      .select({
        Id: user.id,
        name: user.name,
        image: user.image,
      })
      .from(follow)
      .innerJoin(user, eq(user.id, follow.followerId))
      .where(eq(follow.adminId, adminId))

    return followers
  } catch (error) {
    console.log(error)
    return []
  }
}

// User followers
export async function GetUserFollowing(followerId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session)
    return {
      status: false,
      message: 'You are not authorized, please login to continue',
    }

  try {
    const followers = await db
      .select({
        Id: user.id,
        name: user.name,
        image: user.image,
      })
      .from(follow)
      .innerJoin(user, eq(user.id, follow.adminId))
      .where(eq(follow.followerId, followerId))

    return followers
  } catch (error) {
    console.log(error)
    return []
  }
}

//IsFollowing Checker

export async function IsFollowing(adminId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session)
    return {
      status: false,
      message: 'You are not authorized, please login to continue',
    }

  try {
    const isFollowing = await db
      .select()
      .from(follow)
      .where(and(eq(follow.adminId, adminId), eq(follow.followerId, session.user.id)))
      .limit(1)

    return isFollowing.length > 0
  } catch (error) {
    console.log(error)

    return false
  }
}
