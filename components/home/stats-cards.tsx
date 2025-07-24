"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, MessageSquare, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase/client-simple"

export function StatsCards() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalComments: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [{ count: totalUsers }, { count: totalProducts }, { count: totalComments }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
      ])

      setStats({
        totalUsers: totalUsers || 0,
        totalProducts: totalProducts || 0,
        totalComments: totalComments || 0,
      })
    } catch (error) {
      console.error("Erreur récupération stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statsData = [
    {
      title: "Utilisateurs totaux",
      value: loading ? "..." : stats.totalUsers,
      icon: Users,
      description: "Utilisateurs inscrits",
    },
    {
      title: "Produits totaux",
      value: loading ? "..." : stats.totalProducts,
      icon: Package,
      description: "Produits disponibles",
    },
    {
      title: "Commentaires",
      value: loading ? "..." : stats.totalComments,
      icon: MessageSquare,
      description: "Commentaires postés",
    },
    {
      title: "Croissance",
      value: "+12%",
      icon: TrendingUp,
      description: "Ce mois-ci",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
