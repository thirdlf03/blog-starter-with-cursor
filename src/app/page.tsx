import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts, getTagFrequencies } from "@/lib/api";
import TagCloud from "@/app/_components/TagCloud";

export default function Index() {
  const allPosts = getAllPosts();
  const tagFrequencies = getTagFrequencies();

  const heroPost = allPosts[0];

  const morePosts = allPosts.slice(1);

  return (
    <main>
      <Container>
        <Intro />
        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          author={heroPost.author}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        {/* タグクラウド表示 */}
        {/* <div className="my-8">
          <h3 className="text-xl font-bold mb-2">タグクラウド</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <span key={tag} className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div> */}
        <TagCloud tags={tagFrequencies} />
      </Container>
    </main>
  );
}
