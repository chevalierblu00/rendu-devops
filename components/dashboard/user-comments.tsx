import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Eye, Trash2 } from "lucide-react"
import Link from "next/link"

interface UserCommentsProps {
  comments: any[]
}

export function UserComments({ comments }: UserCommentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes Commentaires</CardTitle>
        <CardDescription>
          Vos commentaires sur les produits ({comments.length} commentaire{comments.length !== 1 ? "s" : ""})
        </CardDescription>
      </CardHeader>
      <CardContent>
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun commentaire</h3>
            <p className="text-gray-500 mb-4">Vous n'avez pas encore commenté de produit.</p>
            <Link href="/products">
              <Button>Découvrir les produits</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">Sur: {comment.products?.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {new Date(comment.created_at).toLocaleDateString("fr-FR")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{comment.content}</p>
                    <div className="text-xs text-gray-500">
                      Commenté le{" "}
                      {new Date(comment.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/products/${comment.product_id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
