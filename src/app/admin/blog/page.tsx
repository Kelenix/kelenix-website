export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AddLink, Chip, EditLink, Empty, List, PageHeader, Published, Row } from "@/components/admin/ui";

export default async function AdminBlogPage() {
  await requireAuth("MODERATOR");
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, titleFr: true, category: true, published: true, publishedAt: true, createdAt: true },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Blog" lead={`${posts.length} article${posts.length > 1 ? "s" : ""}`}>
        <AddLink href="/admin/blog/new">Nouvel article</AddLink>
      </PageHeader>

      {posts.length === 0 ? (
        <Empty icon={BookOpen}>Aucun article. Créez votre premier article.</Empty>
      ) : (
        <List>
          {posts.map((post) => (
            <Row
              key={post.id}
              href={`/admin/blog/${post.id}`}
              title={post.titleFr}
              subtitle={`${formatDate(post.publishedAt || post.createdAt, "fr")} · /blog/${post.slug}`}
              chips={
                <>
                  <Chip tone="azure">{post.category}</Chip>
                  <Published on={post.published} />
                </>
              }
              actions={<EditLink href={`/admin/blog/${post.id}`} />}
            />
          ))}
        </List>
      )}
    </div>
  );
}
