// GetLogoPath.ts - IMPROVED VERSION
import fs from 'fs'
import path from 'path'

let cachedLogo: string | null = null

export async function GetLogoPath(): Promise<string> {
  // Return cached version if available
  if (cachedLogo) return cachedLogo

  try {
    const logoPath = path.join(
      process.cwd(),
      'publichttps://res.cloudinary.com/dybyeiofb/image/upload/f_auto/v1755276942/Logo_bbchps.png'
    )

    // Check if file exists first
    if (!fs.existsSync(logoPath)) {
      console.warn('Logo file not found at:', logoPath)
      return 'https://res.cloudinary.com/dybyeiofb/image/upload/f_auto/v1755276942/Logo_bbchps.png' // Fallback to public URL
    }

    const logoBuffer = fs.readFileSync(logoPath)
    const base64Logo = logoBuffer.toString('base64')
    cachedLogo = `data:image/png;base64,${base64Logo}`

    return cachedLogo
  } catch (error) {
    console.error('Error reading logo file:', error)
    return 'https://res.cloudinary.com/dybyeiofb/image/upload/f_auto/v1755276942/Logo_bbchps.png' // Fallback
  }
}
