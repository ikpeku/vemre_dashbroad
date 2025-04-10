"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useRouter } from "next/navigation"
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

export default function Dashboard() {
  const router = useRouter();
  // Sample transaction data
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
  ]

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
          doc.text("Recent Transactions", 14, 22)
          doc.setFontSize(11)
          doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
         
      
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
          doc.save("recent-transactions.pdf")
        })
      })
      .catch((error) => {
        console.error("Error generating PDF:", error)
        alert("Failed to generate PDF. Please try again.")
      })

   


  }


  const handleLogout = () => {
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    localStorage.removeItem("accessToken")
    router.push("/login")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Welcome</h2>
          <p className="text-gray-600">You have successfully logged in to your account.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">All Transactions</span>
              <span className="font-medium">$2,450.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <span className="font-medium text-yellow-600">$350.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Withdrawn</span>
              <span className="font-medium text-red-600">$850.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Received</span>
              <span className="font-medium text-green-600">$1,600.00</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button onClick={handleLogout} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded">
              Logout
            </button>
            {/* <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded">Settings</button> */}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadTransactionsPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Link href="/transactions" className="text-sm font-medium text-primary hover:underline flex items-center">
                See All
              </Link>
            </div>
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
      </div>

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
