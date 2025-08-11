import { CreatePaypalOrder } from "@/app/actions/paypal/paypal";
import { GetInvoiceAction } from "@/app/actions/userActions/Invoice";
import {
  GetPurchaseItem,
  GetSingleProductActions,
  GetUserUploadsAction,
  IsAlreadyBougth,
} from "@/app/actions/userActions/ProductActionsUser";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { productWithUser } from "@/lib/types/productTypes";
import { AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import {
  CircleAlert,
  Download,
  FileText,
  Shapes,
  Share,
  UserPlus,
} from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function ProductDetails({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    success: string;
    error: string;
    cancelled: string;
  }>;
}) {
  const id = (await params).id;
  const product = (await GetSingleProductActions(id)) as productWithUser;
  if (!product) return notFound();
  const { error, success, cancelled } = await searchParams;

  const { count } = await GetUserUploadsAction(product.user.id);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = session?.user;
  const isFree = product.products.price <= 0;

  const isAuthor = product.products.userId === session?.user.id;

  const isAlreadyPurchased = await IsAlreadyBougth(product.products.id);

  const { res } = await GetPurchaseItem(product.products.id);

  const invoice = await GetInvoiceAction(res?.purchase.id as string);

  console.log(invoice, "Invoice");

  async function handlePaypal() {
    "use server";

    const { status, approvalUrl } = await CreatePaypalOrder(
      product.products.id
    );
    if (status) {
      redirect(approvalUrl);
      return;
    }
  }

  async function handleDownload() {
    "use server";

    try {
      const res = await axios.get(
        `http://localhost:3000/api/download/${product.products.id}`
      );

      console.log(res, "Response from download");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {(success || error || cancelled) && (
        <div className="sticky top-0 z-30">
          {success && (
            <Banner variant="success" message="Asset purchase successful" />
          )}
          {cancelled && <Banner variant="warn" message="Purchase cancelled" />}
          {error && (
            <Banner
              variant="error"
              message="Payment failed, please try again"
            />
          )}
        </div>
      )}
      {/* Main Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Image Section */}
          <div className="lg:col-span-2">
            <div className="relative h-[60vh] md:h-[80vh] rounded-2xl overflow-hidden  bg-white">
              <Image
                src={product.products.thumbnailUrl as string}
                alt={product.products.title}
                fill
                className="object-contain p-4 rounded transition-transform duration-300 hover:scale-105"
              />
            </div>
            <h1 className="mt-4 text-center text-2xl font-semibold text-gray-800">
              {product.products.title}
            </h1>
          </div>

          {/* Sidebar Section */}
          <div className="lg:sticky lg:top-20 self-start bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {/* Author Profile */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 ring-2 ring-gray-200">
                  <AvatarImage
                    src={product.user.image as string}
                    alt={product.user.name}
                  />
                  <AvatarFallback>{product.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-lg text-gray-900">
                    {product.user.name}
                  </h2>
                  <p className="text-sm text-gray-500">{count} Resources</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="hover:bg-gray-100 transition-colors">
                <UserPlus size={20} className="mr-2" />
                Follow
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {isLoggedIn ? (
                isAlreadyPurchased ? (
                  <>
                    <Button
                      asChild
                      className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold text-lg">
                      <a
                        href={`/api/download/${id}`}
                        target="_blank"
                        download
                        className="flex items-center justify-center gap-2">
                        <Download size={20} />
                        Download Now
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-gray-300 hover:bg-gray-50">
                      <Link
                        href={`/invoice/${res?.purchase.id}`}
                        className="flex items-center justify-center gap-2">
                        <FileText size={20} />
                        View Invoice
                      </Link>
                    </Button>
                  </>
                ) : isAuthor ? (
                  <div className="text-center p-4 bg-gray-100 rounded-lg">
                    <h2 className="font-semibold text-xl text-gray-800">
                      You Own This Asset
                    </h2>
                    <p className="text-sm text-gray-500">
                      You cannot purchase your own product.
                    </p>
                  </div>
                ) : isFree ? (
                  <Button
                    asChild
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg">
                    <a
                      href={`/api/download/free/${id}`}
                      target="_blank"
                      download
                      className="flex flex-col items-center justify-center">
                      <div className="flex items-center gap-2">
                        <Download size={20} />
                        Download Now
                      </div>
                      <p className="text-xs text-blue-100">
                        Attribution required
                      </p>
                    </a>
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h2 className="text-4xl font-bold text-gray-900">
                        ${(product.products.price / 100).toFixed(2)}
                      </h2>
                    </div>
                    <form action={handlePaypal} className="w-full">
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full h-12 border-2 border-blue-500 hover:bg-blue-50">
                        <div className="relative h-6 w-24">
                          <Image
                            src="/payment/paypal.png"
                            alt="PayPal"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </Button>
                    </form>
                    <Button
                      variant="outline"
                      className="w-full h-12 border-2 border-orange-500 hover:bg-orange-50">
                      <div className="relative h-28 w-24">
                        <Image
                          src="/payment/orangeMoney.png"
                          alt="Orange Money"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </Button>
                  </div>
                )
              ) : (
                <Button
                  asChild
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg">
                  <Link href="/auth">Log In to Download</Link>
                </Button>
              )}
            </div>

            {/* Share and Collection Buttons */}
            {isLoggedIn && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="ghost"
                  className="hover:bg-gray-100 transition-colors">
                  <Shapes size={20} className="mr-2" />
                  Add to Collection
                </Button>
                <Button
                  variant="ghost"
                  className="hover:bg-gray-100 transition-colors">
                  <Share size={20} className="mr-2" />
                  Share
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Banner({
  variant,
  message,
}: {
  variant: "success" | "warn" | "error";
  message: string;
}) {
  const styles =
    variant === "success"
      ? "bg-emerald-500"
      : variant === "warn"
      ? "bg-amber-500"
      : "bg-rose-500";
  return (
    <div
      className={`${styles} flex items-center justify-center gap-2 px-4 py-3 text-white`}
      role="status"
      aria-live="polite">
      <CircleAlert className="h-5 w-5" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
