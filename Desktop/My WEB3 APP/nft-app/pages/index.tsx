import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import { sanityClient, urlFor } from '../sanity';
import { Collection } from '../typings';


interface Props{
  collections: Collection[];
}

const Home = ({ collections }: Props) => {
  return (
    <div className=' mx-auto max-w-7xl min-h-screen flex flex-col  my-20 px-10 2xl:px-0'>
      <Head>
        <title>NFT-Dapp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

       <div className='mb-10 text-4xl font-extralight'>
       <h1 >Welcome to the  
         <span 
         className='cursor-pointer font-extrabold underline
          decoration-green-700/50 hover:text-green-700 '> NFT DROP CHALLENGE</span> </h1>
       </div>


         <main className='bg-slate-200 p-10 shadow-xl shadow-rose-400/20'>
            <div className='grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 '>
              {collections.map(collection => (
                <Link href={`/nft/${collection.slug.current}`} >
                  <div className='flex flex-col items-center cursor-pointer
                    transition-all duration-200 hover:scale-105 '>
                     <img 
                    className='h-96 w-60 rounded-2xl object-cover'
                    src={urlFor(collection.mainImage).url()} alt=''/>

                    <div className='p-5'>
                      <h2 className='text-3xl'>{collection.title}</h2>
                      <p className='mt-2 text-sm text-green-600'>{collection.description}</p>
                      </div>
                  </div>
                  </Link>
              ))}
            </div>
         </main>
               
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
     const query = `*[_type == "collection"]{
      _id,
      title,
      address,
      description,
      nftCollectionName,
      mainImage {
        asset
      },
      previewImage {
        asset
      },
      slug {
        current
      },
      creator-> {
        _id,
        name,
        address,
        slug {
          current
        },
      },
     }`

    const collections = await sanityClient.fetch(query)

    return {
      props: {
        collections
      }
    }
}
