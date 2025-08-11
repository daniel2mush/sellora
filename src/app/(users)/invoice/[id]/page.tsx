// Your invoice page - simplified
import { GetInvoiceAction } from '@/app/actions/userActions/Invoice'
import InvoiceLayout, {
  InvoiceLayoutProps,
} from '@/components/appCompnent/userComponent/invoice/invoiceLayout'
import { GetLogoPath } from '@/getlogoPath'

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [invoice, dataurl] = await Promise.all([GetInvoiceAction(id), GetLogoPath()])

  const cleanInvoice = { ...invoice, logoBaseurl: dataurl }

  if (!invoice)
    return (
      <div className=" flex justify-center items-center h-[60vh] text-2xl ">
        No invoice for this product
      </div>
    )

  return (
    <main className="p-4 bg-gray-100 min-h-screen">
      <InvoiceLayout {...(cleanInvoice as InvoiceLayoutProps)} />
    </main>
  )
}
