import rootAxiosInstance from "../axiosinstance";

interface ActivityProps {
  _id?: string,
  type?:  "Withdraw" | "Received",
  isPending?: boolean,
  title?: string;
  description?: string;
  transactionReference?: string;
  senderName?: string;
  amount?: number;
  category?: string;
  servicelink?: string
  updatedAt?: Date,
  header?: string,
  user?: {
    fullname: string
  }
  
}




const alltransactions = "/api/user/transactions";


class UserServices {


    /**
     * To get all transactions
     * @returns
     */

    
    async alltransactions(): Promise<{data: ActivityProps[]}> {
        const response = await rootAxiosInstance.get(alltransactions);
        return response.data
    }



}

export default UserServices;
