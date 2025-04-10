"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
// import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'

// Define transaction type
type Transaction = {
  id: number
  description: string
  date: string
  amount: string
  amountClass: string
  status: string
  details?: {
    reference: string
    category: string
    paymentMethod: string
    time: string
    note?: string
  }
}

export default function AllTransactions() {
  // Define status badges inline instead of using the Badge component
  const getStatusBadge = (status: string) => {
    const styles = {
      Completed: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Failed: "bg-red-100 text-red-800",
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    )
  }

  // Sample transaction data - in a real app, this would come from an API or database
  const transactions: Transaction[] = [
    {
      id: 1,
      description: "Payment to John",
      date: "Apr 5, 2025",
      amount: "-$250.00",
      amountClass: "text-red-600",
      status: "Completed",
      details: {
        reference: "TXN-20250405-001",
        category: "Transfer",
        paymentMethod: "Bank Account",
        time: "10:23 AM",
        note: "Monthly rent payment",
      },
    },
    {
      id: 2,
      description: "Salary Deposit",
      date: "Apr 1, 2025",
      amount: "+$1,200.00",
      amountClass: "text-green-600",
      status: "Completed",
      details: {
        reference: "TXN-20250401-002",
        category: "Income",
        paymentMethod: "Direct Deposit",
        time: "12:01 AM",
        note: "Monthly salary",
      },
    },
    {
      id: 3,
      description: "Refund from Amazon",
      date: "Mar 29, 2025",
      amount: "+$35.50",
      amountClass: "text-green-600",
      status: "Pending",
      details: {
        reference: "TXN-20250329-003",
        category: "Refund",
        paymentMethod: "Credit Card",
        time: "3:45 PM",
        note: "Return of defective product",
      },
    },
    {
      id: 4,
      description: "Subscription Renewal",
      date: "Mar 28, 2025",
      amount: "-$15.99",
      amountClass: "text-red-600",
      status: "Completed",
      details: {
        reference: "TXN-20250328-004",
        category: "Subscription",
        paymentMethod: "Credit Card",
        time: "6:30 AM",
        note: "Monthly streaming service",
      },
    },
    {
      id: 5,
      description: "ATM Withdrawal",
      date: "Mar 25, 2025",
      amount: "-$100.00",
      amountClass: "text-red-600",
      status: "Failed",
      details: {
        reference: "TXN-20250325-005",
        category: "Withdrawal",
        paymentMethod: "Debit Card",
        time: "2:15 PM",
        note: "Insufficient funds",
      },
    },
    {
      id: 6,
      description: "Online Purchase - Electronics",
      date: "Mar 22, 2025",
      amount: "-$349.99",
      amountClass: "text-red-600",
      status: "Completed",
      details: {
        reference: "TXN-20250322-006",
        category: "Shopping",
        paymentMethod: "Credit Card",
        time: "2:30 PM",
        note: "New headphones",
      },
    },
    {
      id: 7,
      description: "Utility Bill Payment",
      date: "Mar 20, 2025",
      amount: "-$85.75",
      amountClass: "text-red-600",
      status: "Completed",
      details: {
        reference: "TXN-20250320-007",
        category: "Bills",
        paymentMethod: "Bank Account",
        time: "9:15 AM",
        note: "Electricity bill",
      },
    },
    {
      id: 8,
      description: "Restaurant Payment",
      date: "Mar 18, 2025",
      amount: "-$42.50",
      amountClass: "text-red-600",
      status: "Completed",
      details: {
        reference: "TXN-20250318-008",
        category: "Dining",
        paymentMethod: "Credit Card",
        time: "8:45 PM",
        note: "Dinner with friends",
      },
    },
    {
      id: 9,
      description: "Transfer from Savings",
      date: "Mar 15, 2025",
      amount: "+$500.00",
      amountClass: "text-green-600",
      status: "Completed",
      details: {
        reference: "TXN-20250315-009",
        category: "Transfer",
        paymentMethod: "Internal Transfer",
        time: "11:30 AM",
        note: "Moving funds to checking",
      },
    },
    {
      id: 10,
      description: "Mobile Phone Bill",
      date: "Mar 12, 2025",
      amount: "-$59.99",
      amountClass: "text-red-600",
      status: "Completed",
      details: {
        reference: "TXN-20250312-010",
        category: "Bills",
        paymentMethod: "Bank Account",
        time: "10:00 AM",
        note: "Monthly phone service",
      },
    },
  ]

  // State for transaction details dialog
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  // Function to open transaction details
  const openTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDetailsOpen(true)
  }

  // Function to download transactions as PDF
  const downloadTransactionsPDF = () => {
    // We'll use dynamic import to load jsPDF only in the browser
    import("jspdf")
      .then(({ default: jsPDF }) => {
        import("jspdf-autotable").then(() => {
          const doc = new jsPDF()

          // Add title
          doc.setFontSize(18)
          doc.text("All Transactions", 14, 22)
          doc.setFontSize(11)
          doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

          // Define the columns
          const columns = [
            { header: "Description", dataKey: "description" },
            { header: "Date", dataKey: "date" },
            { header: "Amount", dataKey: "amount" },
            { header: "Status", dataKey: "status" },
            { header: "Reference", dataKey: "reference" },
          ]

          // Prepare the data
          const data = transactions.map((transaction) => ({
            description: transaction.description,
            date: transaction.date,
            amount: transaction.amount,
            status: transaction.status,
            reference: transaction.details?.reference || "",
          }))

          // Create the table
          
          
          autoTable(doc, {
            head: [columns.map((column) => column.header)],
            body: data.map((item) => columns.map((column) => item[column.dataKey as keyof typeof item])),
            startY: 40,
            theme: "grid",
            styles: {
              fontSize: 10,
              cellPadding: 3,
            },
            headStyles: {
              fillColor: [66, 66, 66],
              textColor: [255, 255, 255],
              fontStyle: "bold",
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
          })

          // Save the PDF
          doc.save("all-transactions.pdf")
        })
      })
      .catch((error) => {
        console.error("Error generating PDF:", error)
        alert("Failed to generate PDF. Please try again.")
      })
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">All Transactions</h1>
        </div>
        <Button variant="outline" onClick={downloadTransactionsPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 font-medium text-sm text-gray-500">
              <div>Transaction</div>
              <div>Date</div>
              <div>Amount</div>
              <div>Status</div>
              <div></div>
            </div>
            <div className="divide-y">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="grid grid-cols-5 py-3 items-center">
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-gray-500 text-sm">{transaction.date}</div>
                  <div className={transaction.amountClass}>{transaction.amount}</div>
                  <div>{getStatusBadge(transaction.status)}</div>
                  <div className="text-right">
                    <button
                      className="text-sm text-primary hover:underline"
                      onClick={() => openTransactionDetails(transaction)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Complete information about this transaction</DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{selectedTransaction.description}</h3>
                <span className={`font-bold ${selectedTransaction.amountClass}`}>{selectedTransaction.amount}</span>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-gray-500">Status:</div>
                <div>{getStatusBadge(selectedTransaction.status)}</div>

                <div className="text-gray-500">Date:</div>
                <div>{selectedTransaction.date}</div>

                <div className="text-gray-500">Time:</div>
                <div>{selectedTransaction.details?.time}</div>

                <div className="text-gray-500">Reference:</div>
                <div>{selectedTransaction.details?.reference}</div>

                <div className="text-gray-500">Category:</div>
                <div>{selectedTransaction.details?.category}</div>

                <div className="text-gray-500">Payment Method:</div>
                <div>{selectedTransaction.details?.paymentMethod}</div>

                {selectedTransaction.details?.note && (
                  <>
                    <div className="text-gray-500">Note:</div>
                    <div>{selectedTransaction.details.note}</div>
                  </>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
