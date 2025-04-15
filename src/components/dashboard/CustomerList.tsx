"use client"
import React from 'react'
import {useCustomers} from "@/hooks/useCustomers"

type Props = {}

const CustomerList = (props: Props) => {
    const {data: customers, isLoading, isError} = useCustomers()
    console.log(customers)
    return (
        <div>CustomerList</div>
    )
}

export default CustomerList