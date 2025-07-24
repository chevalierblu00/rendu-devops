import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, User, Package } from "lucide-react"
import Link from "next/link"

interface ProductsGridProps {
  products: any[]
}

export function ProductsGrid({ products }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun produit disponible</h3>
        <p className="text-gray-500 mb-6">Soyez le premier à ajouter un produit !</p>
        <Link href="/products/create">
          <Button>Ajouter un produit</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow group">
          <CardHeader className="p-0">
            <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
              <img
                src={
                  product.image_url ||
                  `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(product.title) || "product"}`
                }
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
              <Badge variant="secondary" className="ml-2">
                {product.status}
              </Badge>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{product.profiles?.username || "Anonyme"}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{product.comments?.length || 0}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{new Date(product.created_at).toLocaleDateString("fr-FR")}</span>
              <Link href={`/products/${product.id}`}>
                <Button size="sm">Voir détails</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
