import fs from 'fs';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import { marked } from 'marked';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify/lib';
import remarkParse from 'remark-parse/lib';
import remarkRehype from 'remark-rehype/lib';
import remarkToc from 'remark-toc';
import { unified } from 'unified';
import { createElement } from 'react';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import { visit } from 'unist-util-visit';
import Link from 'next/link';
import { toc } from 'mdast-util-toc'
export async function getStaticProps({params}){

    //目次のところ。　ばぐってやがら
    const getToc = (options) => {
        return (node) => {
          const result = toc(node, options);
          node.children = [result.map];
        };
      };
//上やばい


    const file=fs.readFileSync(`posts/${params.slug}.md`,'utf-8');
    const {data,content}=matter(file);
    const TOC=await unified()
    .use(remarkParse)
    .use(getToc,{
        tight:true
    })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content);
    const result = await unified()
    .use(remarkParse)
    .use(remarkToc)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(content);
    console.log('result:',result.toString());
    return {
        props:{
            frontMatter:data,
            content:result.toString(),
            TOC:TOC.toString(),
        }};
}






export async function getStaticPaths(){
    const files=fs.readdirSync('posts');
    const paths=files.map((fileName)=>({
        params:{
            slug:fileName.replace(/\.md$/,''),
        },
    }));
 
return {
    paths,
    fallback:false,
};
}





const Post=({frontMatter,content,TOC})=>{
    
    console.log(TOC);
    const MyLink=({children,href})=>{
        return (
            <Link href={href}>
          {children}
            </Link>
        )
    }

    const toReactNode = (content) => {
        return unified()
          .use(rehypeParse,{fragment:true})
          .use(rehypeReact, {
            createElement,
            components:{
                a:MyLink
            }
          })
          .processSync(content).result;
      };
    return (

        
    <div className="prose prose-lg max-w-none">
<div className='bortder'>

    <Image
    src={`/${frontMatter.image}`}
    width={1200}
    height={700}
    alt={frontMatter.title}
    />
    </div>
    <h1 className='mt-12'>{frontMatter.title}</h1>
        <span>{frontMatter.date}</span>

     {frontMatter.categories.map((category) => (
      <span key={category}>
        <Link href={`/categories/${category}`}>
          {category}
        </Link>
      </span>
    ))}


<div className="grid grid-cols-12">
    <div className="col-span-9">{toReactNode(content)}</div>
    <div className="col-span-3">
      <div
        className="sticky top-[50px]"
        dangerouslySetInnerHTML={{ __html: TOC }}
      ></div>
    </div>
  </div>
</div>
    


    

        

    )
}

export default Post;