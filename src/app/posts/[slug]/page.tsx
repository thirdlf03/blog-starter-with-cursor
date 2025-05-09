import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { CMS_NAME } from "@/lib/constants";
import markdownToHtml from "@/lib/markdownToHtml";
import Alert from "@/app/_components/alert";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import Link from "next/link";
import SnsShareButtons from "@/app/_components/SnsShareButtons";

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");
  const pageUrl = `https://your-domain.com/posts/${post.slug}`;

  return (
    <main>
      <Alert preview={post.preview} />
      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <PostBody content={content} />

          {/* タグ表示 */}
          <div className="mt-8">
            <h4 className="font-bold mb-2">タグ</h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* SNSシェアボタン */}
          <div className="mt-8">
            <h4 className="font-bold mb-2">この記事をシェア</h4>
            <SnsShareButtons url={pageUrl} title={post.title} />
          </div>

          {/* 関連記事表示 */}
          <RelatedPosts currentSlug={post.slug} tags={post.tags} />
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`;

  return {
    title,
    openGraph: {
      title,
      images: [post.ogImage.url],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 関連記事コンポーネント
function RelatedPosts({ currentSlug, tags }: { currentSlug: string; tags: string[] }) {
  const allPosts = getAllPosts();
  // タグが1つでも一致する記事を抽出（自分自身は除外）
  const related = allPosts.filter(
    (p) => p.slug !== currentSlug && p.tags.some((t) => tags.includes(t))
  ).slice(0, 3); // 最大3件

  if (related.length === 0) return null;

  return (
    <div className="mt-12">
      <h4 className="font-bold mb-2">関連記事</h4>
      <ul className="list-disc pl-5">
        {related.map((p) => (
          <li key={p.slug}>
            <Link href={`/posts/${p.slug}`} className="text-blue-600 hover:underline">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
