"use client";

import React, { useState, useEffect } from "react";
import { InvoiceTypes } from "@/lib/types/productTypes";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import dynamic from "next/dynamic";

// Dynamically import PDFDownloadLink to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <button
        disabled
        className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">
        Loading...
      </button>
    ),
  }
);

export interface InvoiceLayoutProps extends InvoiceTypes {
  logoBaseurl: string;
}

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 32, fontFamily: "Helvetica", fontSize: 10 },
  logoContainer: {
    width: 80,
    height: 80,
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { maxWidth: 80, maxHeight: 80, objectFit: "contain" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  gray: { color: "#6B7280" },
  bold: { fontWeight: "bold", marginBottom: 5 },
  table: {
    display: "flex",
    width: "100%",
    border: "1px solid #D1D5DB",
    marginBottom: 20,
  },
  tableHeader: { flexDirection: "row", backgroundColor: "#F3F4F6", padding: 8 },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderTop: "1px solid #D1D5DB",
  },
  tableCell: { flex: 1 },
  tableCellRight: { flex: 1, textAlign: "right" },
  totals: { alignItems: "flex-end" },
  totalRow: { flexDirection: "row", marginBottom: 4 },
  totalLabel: { minWidth: 80, textAlign: "right", marginRight: 16 },
  totalValue: { minWidth: 80, textAlign: "right" },
  grandTotal: { fontSize: 12, fontWeight: "bold" },
  footer: { marginTop: 32, textAlign: "center", fontSize: 9, color: "#6B7280" },
});

// PDF Document Component
const InvoicePDF = ({
  buyer,
  product,
  seller,
  invoices,
  logoBaseurl,
}: InvoiceLayoutProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} src={logoBaseurl} />
      </View>

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Invoice</Text>
          <Text style={styles.gray}>#{invoices.invoiceNumber}</Text>
          <Text style={styles.gray}>
            Issued: {invoices.issueDate.toDateString()}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.bold}>Seller:</Text>
          <Text>{seller.name}</Text>
          <Text>{seller.email}</Text>
        </View>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={styles.bold}>Billed to:</Text>
        <Text>{buyer.name}</Text>
        <Text>{buyer.email}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.bold]}>Item</Text>
          <Text style={[styles.tableCellRight, styles.bold]}>
            Price ({invoices.currency})
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{product.name}</Text>
          <Text style={styles.tableCellRight}>
            {(product.price / 100).toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>
            {(invoices.subtotal / 100).toFixed(2)} {invoices.currency}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax:</Text>
          <Text style={styles.totalValue}>
            {(invoices.tax / 100).toFixed(2)} {invoices.currency}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, styles.grandTotal]}>Total:</Text>
          <Text style={[styles.totalValue, styles.grandTotal]}>
            {(invoices.total / 100).toFixed(2)} {invoices.currency}
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>Thank you for your purchase!</Text>
    </Page>
  </Document>
);

// Main Component
export default function InvoiceLayout(props: InvoiceLayoutProps) {
  const { buyer, product, seller, invoices, logoBaseurl } = props;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mb-4 print:hidden">
        {/* Only render PDF button on client */}
        {isClient && (
          <PDFDownloadLink
            document={<InvoicePDF {...props} />}
            fileName={`invoice_${invoices.invoiceNumber}.pdf`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
            {({ loading }) => (loading ? "Generating..." : "Download PDF")}
          </PDFDownloadLink>
        )}

        <button
          onClick={() => window.print()}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">
          Print
        </button>
      </div>

      {/* Invoice Display */}
      <div className="bg-white border border-gray-300 p-8 text-sm print:border-none print:shadow-none">
        <img
          src={logoBaseurl || "/Logo.png"}
          alt="logo"
          className="w-20 h-20 object-contain mb-6"
        />

        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Invoice</h2>
            <p className="text-gray-500">#{invoices.invoiceNumber}</p>
            <p className="text-gray-500">
              Issued: {invoices.issueDate.toDateString()}
            </p>
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
              <th className="border border-gray-300 p-2 text-right">
                Price ({invoices.currency})
              </th>
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

        <div className="mt-8 text-xs text-gray-500 text-center">
          Thank you for your purchase!
        </div>
      </div>
    </div>
  );
}
