import { GetUserInformation } from "@/app/actions/userActions/userActions";
import { NOTFOUND } from "dns";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const { userInfo: user } = await GetUserInformation(id);

  if (!user) return notFound();

  return (
    <div>
      <div>
        {/* User profile */}
        <div className=" relative h-20 w-20 rounded-full ">
          <Image
            src={user?.image as string}
            alt={user.name}
            fill
            className=" object-cover"
          />
        </div>
      </div>
    </div>
  );
}
