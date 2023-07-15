import PostCard from '@/components/PostCard';
import fs from 'fs'
import matter from 'gray-matter';
export const getStaticProps=({params})=>{
    const files=fs.readdirSync('posts');
    const posts=files.map((fileName)=>{
        const slug=fileName.replace(/\.md$/,'');
        const fileContent=fs.readFileSync(`posts/${fileName}`,'utf-8');
        const {data}=matter(fileContent);
        return {
            frontMatter: data,
            slug,
        };
    });
    const category=params.category;
    const filteredPosts=posts.filter((post)=>{
        return post.frontMatter.categories.includes(category);
    })
    const sortedPosts = filteredPosts.sort((Pa,Pb)=>{
        new Date(Pa.frontMatter.date)>new Date(Pb.frontMatter.date)?-1:1
    })
    return {
        props:{
            posts:sortedPosts,
        },
    };
};

export const getStaticPaths=()=>{
    const categories=['react','laravel'];
    const paths=categories.map((category)=>({
        params:{category}
    }))
    return {
        paths,
        fallback: false
    }
}

const Category=({posts})=>{
    return(
        <div className='my-8'>
<div className='grid grid-cols-3 gap-4'>
    {posts.map((post)=>(
        <PostCard key={post.slug} post={post} />
    ))
    }
</div>

        </div>
    );
};
export default Category;