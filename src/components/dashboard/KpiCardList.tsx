"use client"

import React from 'react'
import KpiCard from './KpiCard'
import {useKpis} from '@/hooks/useKpi'
import KPISkeleton from './KpiCardSkeleton'

type Props = {}

const KpiCardList = (props: Props) => {
  const {data, isLoading, isError} = useKpis()
  return (
    <div className='grid lg:grid-cols-4 gap-4'>
        {isLoading && [1,2,3,4].map((i) => (
            <KPISkeleton key={i} />
        ))}
    
        {isError && <p>Error loading data</p>}
        {data && data.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
            ))}
            {/* Placeholder cards for demonstration */}
    </div>
  )
}

export default KpiCardList