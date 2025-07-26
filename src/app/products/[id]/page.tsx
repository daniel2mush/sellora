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
import { promises } from "dns";
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
import { redirect } from "next/navigation";
import { toast } from "sonner";

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
    <div className="">
      {/* Error handeling for purchases */}
      {success && (
        <div className=" w-full p-4 text-center text-white bg-green-400 flex justify-center items-center gap-2 ">
          <CircleAlert />
          <h1>Asset purchase successful</h1>
        </div>
      )}
      {cancelled && (
        <div className=" w-full p-4 text-center text-white bg-red-400 flex justify-center items-center gap-2 ">
          <CircleAlert />
          <h1>Purchase cancelled</h1>
        </div>
      )}
      {error && (
        <div className=" w-full p-4 text-center text-white bg-red-400 flex justify-center items-center gap-2 ">
          <CircleAlert />
          <h1>Payment failed, please try again</h1>
        </div>
      )}
      {/* Grid */}
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-6">
        {/* Grid one */}
        <div className=" lg:col-span-2  w-full bg-gray-50 p-5 ">
          <div className=" relative h-[80vh] ">
            <Image
              src={product.products.thumbnailUrl as string}
              alt={product.products.title}
              fill
              className=" object-contain"
            />
          </div>
          <div>
            <h1 className=" text-center font-bold text-gray-400 ">
              {product.products.title}
            </h1>
          </div>
        </div>
        {/* Grid 2 */}
        <div className=" h-full place-items-center py-[10vh]">
          <div className=" w-[70%] space-y-5">
            {/* Profile */}
            <div className=" flex justify-between items-center gap-4">
              <div className=" flex items-center gap-6">
                <Avatar className=" w-15 h-15">
                  <AvatarFallback>{product.user.name.charAt(0)}</AvatarFallback>
                  <AvatarImage
                    src={product.user.image as string}
                    alt={product.user.name}
                  />
                </Avatar>

                <div>
                  <h1 className=" font-bold">{product.user.name}</h1>
                  {/* Total uploads */}
                  <p className=" text-sm text-muted-foreground">
                    {count} Resources
                  </p>
                </div>
              </div>
              {/* Follow button */}
              <button className=" aspect-square bg-gray-100 p-2 rounded cursor-pointer hover:bg-gray-200">
                <div className=" flex flex-col justify-center items-center">
                  <UserPlus size={18} strokeWidth={3} />
                  <h1 className=" text-sm font-bold">Follow</h1>
                </div>
              </button>
            </div>

            {/* Download button */}

            <div>
              {isLoggedIn ? (
                isAlreadyPurchased ? (
                  <div className=" place-items-center">
                    <form className=" w-full">
                      <Button
                        type="submit"
                        className=" cursor-pointer bg-green-600 w-full">
                        <a
                          href={`/api/download/${id}`}
                          target="_blank"
                          download
                          className="flex items-center gap-1.5 ">
                          <Download />
                          Download now
                        </a>
                      </Button>
                    </form>

                    <Link
                      href={`/invoice/${res?.purchase.id}`}
                      className=" flex justify-center items-center w-[50%] gap-3 mt-4 border rounded p-1">
                      <FileText />
                      Invoice
                    </Link>
                  </div>
                ) : isAuthor ? (
                  <div className=" text-center">
                    <h1 className="font-bold text-xl">You own this asset</h1>
                    <p>You cannot buy your own asset</p>
                  </div>
                ) : isFree ? (
                  <Button className=" w-full h-16">
                    <div className=" w-full py-10 cursor-pointer  ">
                      <a
                        href={`/api/download/free/${id}`}
                        target="_blank"
                        download
                        className="flex items-center gap-1.5 text-center justify-center font-bold text-xl ">
                        <Download />
                        Download now
                      </a>{" "}
                      <p className=" text-sm text-muted-foreground">
                        Attribution required
                      </p>
                    </div>
                  </Button>
                ) : (
                  <div className=" space-y-5">
                    {/* Product price */}
                    <div className=" text-center">
                      <h1 className=" font-bold text-5xl">
                        ${(product.products.price / 100).toFixed(2)}
                      </h1>
                    </div>
                    {/* Pay with paypal */}
                    <form action={handlePaypal}>
                      <Button variant={"outline"} className=" h-10 w-full p-4">
                        <div className=" relative h-6 w-full ">
                          <Image
                            src={"/payment/paypal.png"}
                            alt="paypal"
                            fill
                            className="
                         object-contain
                        "
                          />
                        </div>
                      </Button>
                    </form>
                    {/* Pay with orange money */}

                    <Button
                      variant={"outline"}
                      className=" h-10 w-full p-4 overflow-hidden">
                      <div className=" relative h-20 w-full overflow-hidden ">
                        <Image
                          src={"/payment/orangeMoney.png"}
                          alt="paypal"
                          fill
                          className="
                         object-contain
                        "
                        />
                      </div>
                    </Button>
                  </div>
                )
              ) : (
                <Button className=" w-full h-14">
                  <Link href={"/auth"} className=" font-bold text-2xl">
                    Log in to download
                  </Link>
                </Button>
              )}
            </div>

            {/* Share and add to collection button */}
            {isLoggedIn && (
              <div className=" grid grid-cols-2 gap-4">
                <Button variant={"ghost"} className=" cursor-pointer">
                  <Shapes size={18} />
                  <h1 className=" text-sm font-medium">Collections</h1>
                </Button>
                <Button variant={"ghost"} className=" cursor-pointer">
                  <Share size={18} />
                  <h1 className=" text-sm font-medium">Share</h1>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
