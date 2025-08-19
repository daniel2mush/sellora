import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { rgb } from 'culori'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertOklchToRgb(element: HTMLElement) {
  const convertedColors: string[] = []
  const elements = [element, ...element.querySelectorAll('*')] as HTMLElement[]

  // Process all elements
  for (const el of elements) {
    const computedStyles = window.getComputedStyle(el)

    // Log all computed styles for debugging
    console.log(`Inspecting ${el.tagName} (class: ${el.className || 'none'})`, {
      color: computedStyles.color,
      backgroundColor: computedStyles.backgroundColor,
    })

    // Check color property
    if (computedStyles.color.includes('oklch')) {
      const oklchColor = computedStyles.color
      try {
        const parsed = oklchColor.match(/oklch\(([^)]+)\)/)
        if (parsed) {
          const [l, c, h] = parsed[1].split(' ').map(Number)
          const rgbColor = rgb({ mode: 'oklch', l, c, h })
          const rgbString = `rgb(${Math.round(rgbColor.r * 255)}, ${Math.round(
            rgbColor.g * 255
          )}, ${Math.round(rgbColor.b * 255)})`
          el.style.color = rgbString
          convertedColors.push(
            `Color on ${el.tagName} (class: ${
              el.className || 'none'
            }): ${oklchColor} -> ${rgbString}`
          )
        }
      } catch (error) {
        console.warn(`Failed to parse oklch color on ${el.tagName}: ${oklchColor}`, error)
        el.style.color = 'rgb(0, 0, 0)'
        convertedColors.push(
          `Color on ${el.tagName} (class: ${
            el.className || 'none'
          }): ${oklchColor} -> rgb(0, 0, 0) (fallback)`
        )
      }
    }

    // Check background-color property
    if (computedStyles.backgroundColor.includes('oklch')) {
      const oklchColor = computedStyles.backgroundColor
      try {
        const parsed = oklchColor.match(/oklch\(([^)]+)\)/)
        if (parsed) {
          const [l, c, h] = parsed[1].split(' ').map(Number)
          const rgbColor = rgb({ mode: 'oklch', l, c, h })
          const rgbString = `rgb(${Math.round(rgbColor.r * 255)}, ${Math.round(
            rgbColor.g * 255
          )}, ${Math.round(rgbColor.b * 255)})`
          el.style.backgroundColor = rgbString
          convertedColors.push(
            `Background on ${el.tagName} (class: ${
              el.className || 'none'
            }): ${oklchColor} -> ${rgbString}`
          )
        }
      } catch (error) {
        console.warn(`Failed to parse oklch background on ${el.tagName}: ${oklchColor}`, error)
        el.style.backgroundColor = 'rgb(255, 255, 255)'
        convertedColors.push(
          `Background on ${el.tagName} (class: ${
            el.className || 'none'
          }): ${oklchColor} -> rgb(255, 255, 255) (fallback)`
        )
      }
    }
  }

  // Log converted colors
  if (convertedColors.length > 0) {
    console.log('Converted oklch colors:', convertedColors)
  } else {
    console.log('No oklch colors found in elements.')
  }

  // Check for remaining oklch colors
  const remainingOklch = elements.some((el) => {
    const styles = window.getComputedStyle(el)
    const hasOklch = styles.color.includes('oklch') || styles.backgroundColor.includes('oklch')
    if (hasOklch) {
      console.warn(`Remaining oklch in ${el.tagName} (class: ${el.className || 'none'})`, {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      })
    }
    return hasOklch
  })

  if (remainingOklch) {
    console.warn('Warning: Some oklch colors remain after conversion. Check computed styles.')
  } else {
    console.log('No remaining oklch colors detected.')
  }
}
