import React from 'react';
import { useMetamask, useDisconnect, useAddress } from "@thirdweb-dev/react";
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../sanity';
import { Collection } from '../../typings';
import Link from 'next/link';


interface Props {
  collection: Collection
}

function NFTDropPage({ collection }: Props) {

    // AUTH
    const connectWithMetmask = useMetamask();
    const address = useAddress();
    const disconnect = useDisconnect();

  return (
    <div className='flex h-screen flex-col lg:grid lg:grid-cols-10 '>
       
       <div className='lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-600'>
        {/* left side */}
        <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
            <div className='bg-gradient-to-br from-yellow-700 to-purple-800
             p-2' >
           <img 
           className='w-44 rounded-xl object-cover lg:h-96 lg:w-72'
           src={urlFor(collection.previewImage).url()} 
           alt='' />
           </div>
           <div className='space-y-2 text-center p-5'>
            <h1 className='text-4xl font-bold text-yellow-300 '>
                {collection.nftCollectionName}
            </h1>
            <h2 className='text-gray-200'>
               {collection.description}
            </h2>
           </div>
        </div>
       </div>
        {/* right side */}
       <div className='flex flex-1 flex-col p-12 lg:col-span-6 bg-slate-300'>
        {/* Header */}
        
        <header className='flex items-center justify-between'>
        <Link href={'/'} >
            <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80'>
            The{' '}
            <span className='font-extrabold underline decoration-slate-700/50'>Bazz Nation{' '}</span> NFT Market Place
            </h1>
            </Link>
            <button onClick={() => (address ? disconnect() : connectWithMetmask())} className='rounded-full bg-rose-600 text-white px-4 py-2 text-xs font-bold 
            lg:px-5 lg:py-3 lg:text-base '>
                {address ? 'Sign Out' : 'Sign In'}
            </button>
        </header>
          <hr className='my-2 border'/>
          {address &&
            <p className='font-semibold text-green-700 text-center border border-rose-400/20 p-2 
            rounded-full text-sm sm:w-80 '>You're Logged with  wallet:<span className='font-bold'> {address.substring(0, 5)}...{address.substring(address.length -5)}</span> </p>
          }

         {/* Content */}
         <div className='mt-10 flex flex-1 flex-col items-center 
          space-x-6 text-center lg:space-y-0 lg:justify-center'>
            <img 
            className='w-80 object-cover pb-10 lg:h-70 lg:w-50'
            src={urlFor(collection.mainImage).url()}  
            alt='' />
      
             <h1 className='text-2xl font-bold lg:text-3xl lg:font-extrabold'>The Ape Coding Club | NFT Drop</h1>
           
           <p className='pt-2 text-xl text-orange-700 cursor-pointer hover:text-slate-800 rounded-full'>13 / 21 NFT's 
           claimed</p>
         </div>

         {/* Mint Button */}
         <button className='h-16 mt-10  w-full rounded-full bg-gradient-to-br from-green-900 to-purple-900  text-white font-bold 
          '>
            Mint NFT (0.01)
        </button>

       </div>
        <Link href='/'>
           <footer className='sticky bottom-2 w-full cursor-pointer'>
               <div className='flex items-left justify-left'>
          
                <img
                   className=' rounded-full filter grayscale hover:grayscale-0'
                   width={50} height={50}
             
                  src='https://nfpsynergy.net/image-for/node/4421?facebookPeaseUpdateYourCache=1'
                   alt='footer' />
               </div>
            </footer>
         </Link>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({params}) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
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

  const collection = await sanityClient.fetch(query, {
    id: params?.id
  })
  if (!collection) {
    return {
      notFound: true
    }
  }
  return {
    props:{
      collection,
    }
  }
}