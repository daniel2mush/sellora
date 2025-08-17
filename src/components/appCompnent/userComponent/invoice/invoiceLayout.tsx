'use client'

import React from 'react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { saveAs } from 'file-saver'
import { InvoiceTypes } from '@/lib/types/productTypes'
import Image from 'next/image'

export interface InvoiceLayoutProps extends InvoiceTypes {
  logoBaseurl: string
}

export default function InvoiceLayout(props: InvoiceLayoutProps) {
  const { buyer, product, seller, invoices, logoBaseurl } = props

  const generateInvoicePDF = async () => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const { width, height } = page.getSize()

    const drawText = (text: string, x: number, y: number, size = 12) => {
      page.drawText(text, {
        x,
        y,
        size,
        font,
        color: rgb(0, 0, 0),
      })
    }

    const drawTable = (
      headers: string[],
      rows: string[][],
      startX: number,
      startY: number,
      colWidths: number[],
      rowHeight: number
    ) => {
      const borderColor = rgb(0.8, 0.8, 0.8)
      const headerBg = rgb(0.95, 0.95, 0.95)
      const fontSize = 12

      // Header row
      let x = startX
      headers.forEach((header, i) => {
        page.drawRectangle({
          x,
          y: startY,
          width: colWidths[i],
          height: rowHeight,
          borderColor,
          borderWidth: 1,
          color: headerBg,
        })
        page.drawText(header, {
          x: x + 5,
          y: startY + 8,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        })
        x += colWidths[i]
      })

      // Data rows
      rows.forEach((row, rowIndex) => {
        let x = startX
        const y = startY - rowHeight * (rowIndex + 1)
        row.forEach((cell, i) => {
          page.drawRectangle({
            x,
            y,
            width: colWidths[i],
            height: rowHeight,
            borderColor,
            borderWidth: 1,
          })
          page.drawText(cell, {
            x: x + 5,
            y: y + 8,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          })
          x += colWidths[i]
        })
      })
    }

    // 🖼️ Embed logo
    try {
      const logoUrl =
        logoBaseurl ||
        'https://res.cloudinary.com/dybyeiofb/image/upload/v1755276942/Logo_bbchps.png'
      const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer())
      const logoImage = await pdfDoc.embedPng(logoBytes)
      const logoDims = logoImage.scale(0.07) // Adjust scale as needed

      page.drawImage(logoImage, {
        x: 50,
        y: height - 100,
        width: logoDims.width,
        height: logoDims.height,
      })
    } catch (err) {
      console.warn('Logo failed to load:', err)
    }

    // Header
    drawText('Invoice', 50, height - 140, 20)
    drawText(`#${invoices.invoiceNumber}`, 50, height - 170)
    drawText(`Issued: ${invoices.issueDate.toDateString()}`, 50, height - 190)

    // Seller
    drawText('Seller:', width - 200, height - 170)
    drawText(seller.name, width - 200, height - 190)
    drawText(seller.email, width - 200, height - 210)

    // Buyer
    drawText('Billed to:', 50, height - 230)
    drawText(buyer.name, 50, height - 250)
    drawText(buyer.email, 50, height - 270)

    // Table
    const headers = ['Item', `Price (${invoices.currency})`]
    const rows = [[product.name, (product.price / 100).toFixed(2)]]
    const colWidths = [300, 150]
    const rowHeight = 30
    drawTable(headers, rows, 50, height - 310, colWidths, rowHeight)

    // Totals
    drawText(
      `Subtotal: ${(invoices.subtotal / 100).toFixed(2)} ${invoices.currency}`,
      width - 200,
      height - 370
    )
    drawText(
      `Tax: ${(invoices.tax / 100).toFixed(2)} ${invoices.currency}`,
      width - 200,
      height - 390
    )
    drawText(
      `Total: ${(invoices.total / 100).toFixed(2)} ${invoices.currency}`,
      width - 200,
      height - 410,
      12
    )

    // Footer
    drawText('Thank you for your purchase!', width / 2 - 100, 50, 10)

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, `invoice_${invoices.invoiceNumber}.pdf`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mb-4 print:hidden">
        <button
          onClick={generateInvoicePDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Download PDF
        </button>

        <button
          onClick={() => window.print()}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
        >
          Print
        </button>
      </div>

      {/* Invoice Display */}
      <div className="bg-white border border-gray-300 p-8 text-sm print:border-none print:shadow-none">
        <Image
          src={
            logoBaseurl ||
            'https://res.cloudinary.com/dybyeiofb/image/upload/v1755276942/Logo_bbchps.png'
          }
          alt="logo"
          width={80} // equivalent to w-20
          height={80} // equivalent to h-20
          className="object-contain mb-6"
        />

        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Invoice</h2>
            <p className="text-gray-500">#{invoices.invoiceNumber}</p>
            <p className="text-gray-500">Issued: {invoices.issueDate.toDateString()}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold mb-1">Seller:</p>
            <p>{seller.name}</p>
            <p>{seller.email}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="font-semibold mb-1">Billed to:</p>
          <p>{buyer.name}</p>
          <p>{buyer.email}</p>
        </div>

        <table className="w-full mb-6 border border-gray-300 border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left">Item</th>
              <th className="border border-gray-300 p-2 text-right">Price ({invoices.currency})</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">{product.name}</td>
              <td className="border border-gray-300 p-2 text-right">
                {(product.price / 100).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="text-right space-y-1">
          <p>
            Subtotal: {(invoices.subtotal / 100).toFixed(2)} {invoices.currency}
          </p>
          <p>
            Tax: {(invoices.tax / 100).toFixed(2)} {invoices.currency}
          </p>
          <p className="text-base font-bold">
            Total: {(invoices.total / 100).toFixed(2)} {invoices.currency}
          </p>
        </div>

        <div className="mt-8 text-xs text-gray-500 text-center">Thank you for your purchase!</div>
      </div>
    </div>
  )
}
