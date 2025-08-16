'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { assets, products, user } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const SetUserToAdminActions = async (userId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) redirect('/auth')

  if (session.user.role === 'admin')
    return {
      status: false,
      message: 'You are already an admin user',
    }

  try {
    await db
      .update(user)
      .set({
        role: 'admin',
      })
      .where(eq(user.id, userId))
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/dashboard')

    return {
      status: true,
      message: 'You have become an admin successfully',
    }
  } catch (error) {
    console.log(error)

    return {
      status: false,
      message: 'Error occured, please try again',
    }
  }
}

export type searchQueryProps = 'psd' | 'photo' | 'png' | 'svg' | 'template' | 'vector'

export async function GetUserInformation(userId: string, content?: searchQueryProps) {
  const filters = [eq(products.userId, userId)]

  if (content) {
    filters.push(eq(assets.category, content))
  }

  try {
    const [userInfo] = await db
      .select()
      .from(user)
      .where(and(eq(user.id, userId)))

    const product = await db
      .select()
      .from(products)
      .leftJoin(assets, eq(assets.productId, products.id))
      .where(and(...filters))

    return {
      status: true,
      user: { userInfo, product },
    }
  } catch (error) {
    console.log(error)

    return {
      status: false,
      message: 'Something went wrong, please try again later',
    }
  }
}
