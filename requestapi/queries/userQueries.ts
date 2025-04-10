import { useMutation, useQuery } from "@tanstack/react-query"
import UserServices from "../instances/userRequest";
import { Tcreate_transactionSchema } from "constants/transaction.type";


const { createusertransaction, alltransactions} = new UserServices()

class UserQueries {

    // staleTime: 1000, gcTime: 1000,
  
    useAlTransactions = () => {
        return useQuery({queryKey:["alltransactions"], queryFn: alltransactions });
    };



     setCreateusertransaction = () => useMutation({
        mutationFn: (data:Tcreate_transactionSchema) => {
          return createusertransaction(data)
        },
      })
}

export default UserQueries;