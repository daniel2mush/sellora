import { DownloadAction, GetAssetActions } from '@/app/actions/userActions/ProductActionsUser'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  console.log(id, 'ID')

  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { assets } = await GetAssetActions(id)
  if (!assets) {
    return NextResponse.redirect(new URL('/gallery', request.url))
  }

  if (assets.products.price > 0)
    return NextResponse.json({ message: 'Cannot download paid asset' }, { status: 401 })

  const cloudinaryUrl = assets.assets.url

  const cloudinaryRes = await fetch(cloudinaryUrl)
  console.log(cloudinaryRes, 'Res cloudinary')

  if (!cloudinaryRes.ok) {
    return new NextResponse('File fetch failed', { status: 500 })
  }

  const { status } = await DownloadAction({
    assetId: assets.assets.id,
    userId: session.user.id,
  })

  if (status) {
    const buffer = await cloudinaryRes.arrayBuffer()
    const contentType = cloudinaryRes.headers.get('content-type') || 'application/octet-stream'
    const extension = contentType.split('/')[1] || 'bin'

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${assets.products.title}.${extension}"`,
        'Cache-Control': 'no-store',
      },
    })
  }
}
