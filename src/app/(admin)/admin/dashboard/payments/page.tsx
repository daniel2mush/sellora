import { GetproductTotals } from "@/app/actions/productAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Payments() {
  const { res } = await GetproductTotals();
  return (
    <div>
      {/* Table */}
      <h1 className=" text-2xl font-bold mb-10">Purchase Table</h1>
      <div>
        <Table>
          <TableHeader>
            <TableRow className=" bg-muted/50 hover:bg-muted/70">
              <TableHead className=" font-bold text-[16px]">Photo</TableHead>
              <TableHead className=" font-bold text-[16px]">User</TableHead>
              <TableHead className=" font-bold text-[16px]">Email</TableHead>
              <TableHead className=" font-bold text-[16px]">Product</TableHead>
              <TableHead className=" font-bold text-[16px]">Status</TableHead>
              <TableHead className=" font-bold text-[16px]">Method</TableHead>
              <TableHead className=" font-bold text-[16px]">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {res?.map(({ products, purchaseItems, user }, i) => (
              <TableRow
                key={i}
                className={i % 2 === 0 ? "bg-white" : "bg-muted/60"}>
                {purchaseItems && (
                  <>
                    <TableCell>
                      <Avatar>
                        <AvatarFallback className=" bg-amber-700 text-white font-bold">
                          {user?.name.charAt(0)}
                        </AvatarFallback>
                        <AvatarImage
                          src={user?.image as string}
                          alt={user?.name}
                        />
                      </Avatar>
                    </TableCell>
                    <TableCell className=" font-medium">{user?.name}</TableCell>
                    <TableCell>
                      <h1>{user?.email}</h1>
                    </TableCell>
                    <TableCell>
                      <h1>{products.title}</h1>
                    </TableCell>
                    <TableCell className=" text-center bg-green-500 text-white font-semibold">
                      <h1> PAID</h1>
                    </TableCell>
                    <TableCell>Paypal</TableCell>
                    <TableCell className=" font-semibold text-[16px]">
                      <h1>${(products.price / 100).toFixed(2)}</h1>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
