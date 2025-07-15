import { ReactNode } from "react";

export default function AddProductsModal({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg">{children}</div>
    </div>
  );
}
