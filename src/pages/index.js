import PostCard from '@/components/PostCard';
import fs from 'fs';
import matter from 'gray-matter';
import Link from 'next/link';
export async function getStaticProps(){
  const files=fs.readdirSync('posts');
  const posts=files.map((fileName)=>{
    const slug= fileName.replace(/\.md$/,'');
    const fileContent=fs.readFileSync(`posts/${fileName}`,'utf-8');
    const {data}=matter(fileContent);
  //  console.log(data);
    return {
      frontMatter:data,
      slug,
    };

  })
  const sortedPosts=posts.sort((postA,postB)=>
  new Date(postA.frontMatter.date)>new Date(postB.frontMatter.date)?-1:1
  );
  return {
    props:{
      posts,
    },
  };
};

export default function Home({posts}) {
  console.log(posts);
 
  return (
    <div className='my-8'>
      <dev className="grid grid-cols-3 gap-4">    
        {posts.map((post)=>(
        <PostCard key={post.slug} post={post} />
      ))}
      </dev>
    </div>
    
  );
  
}
