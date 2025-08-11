import { GetAllPurchasedItems } from "@/app/actions/userActions/ProductActionsUser";
import { Download, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Orders() {
  const { res } = await GetAllPurchasedItems();

  console.log(res, "RES");

  if (res?.length! <= 0)
    return (
      <div className=" text-2xl font-bold flex justify-center items-center min-h-[60vh]">
        No purchased products !
      </div>
    );

  return (
    <div className=" mx-10 pt-10">
      <h1 className=" text-3xl font-bold mb-10 ">My Purchases</h1>

      {/* Content */}
      {res!.map(({ products, purchase, purchaseItems }) => (
        <div
          key={products.id}
          className=" mb-6 flex justify-between items-center  gap-3">
          <div className=" flex items-center gap-4">
            {/* Image */}
            <div className=" relative w-[200px] h-[150px]  rounded overflow-hidden">
              <Image
                src={products.thumbnail as string}
                alt={products.title}
                fill
                className=" object-cover"
              />
            </div>
            {/* Product title and price */}
            <div>
              <h1 className=" ">{products.title}</h1>
              <p className=" font-bold">
                ${(purchaseItems.price / 100).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className=" flex items-center justify-center gap-3  ">
            <div>
              <button
                type="submit"
                className=" cursor-pointer bg-green-600 w-full rounded text-white">
                <a
                  href={`/api/download/${products.id}`}
                  target="_blank"
                  download
                  className="flex items-center gap-1.5 ">
                  <div className=" py-2 px-5 flex items-center justify-center gap-3 ">
                    {" "}
                    <Download size={15} /> Download
                  </div>
                </a>
              </button>
            </div>

            <Link
              href={`/invoice/${purchase.id}`}
              className=" flex justify-center items-center w-[50%] gap-3 py-2 px-5  border rounded p-1">
              <FileText />
              Invoice
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
