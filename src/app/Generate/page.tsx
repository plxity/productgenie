'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useState, useEffect } from 'react';
import { UploadDropzone } from 'react-uploader';
import { Uploader } from 'uploader';
import supabase from '../lib/supabase';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoadingDots from '../components/LoadingDots';
import appendNewToName from '../utils/appendNewToName';
import downloadPhoto from '../utils/downloadPhoto';

const uploader = Uploader({
  apiKey: 'free',
});

const options = {
  maxFileCount: 1,
  mimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  editor: { images: { crop: false } },
  styles: {
    colors: {
      primary: '#2563EB', // Primary buttons & links
      error: '#d23f4d', // Error messages
      shade100: '#fff', // Standard text
      shade200: '#fffe', // Secondary button text
      shade300: '#fffd', // Secondary button text (hover)
      shade400: '#fffc', // Welcome text
      shade500: '#fff9', // Modal close button
      shade600: '#fff7', // Border
      shade700: '#fff2', // Progress indicator background
      shade800: '#fff1', // File item background
      shade900: '#ffff', // Various (draggable crop buttons, etc.)
    },
  },
};

export default function DreamPage() {
  const [productDescription, setProductDescription] = useState<string>('');
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const UploadDropZone = useCallback(() => {
    return (
      <UploadDropzone
        uploader={uploader}
        options={options}
        onUpdate={(file) => {
          if (file.length !== 0) {
            setPhotoName(file[0].originalFile.originalFileName);
            setOriginalPhoto(file[0].fileUrl.replace('raw', 'thumbnail'));
          }
        }}
        width="670px"
        height="320px"
      />
    )

  }, [])

  useEffect(() => {
    const isUserLoggedIn = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setIsLoggedIn(true);
      }
      else {
        setIsLoggedIn(false);
      }
      setIsChecking(false);
    }
    isUserLoggedIn()
  }, [])
  const onGenerate = () => {
    generatePhoto(originalPhoto, productDescription);
    setError(null);
  };
  async function generatePhoto(
    fileUrl: string | null,
    productDescription: string | null
  ) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    setLoading(true);
    const res = await fetch('/Generate/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl: fileUrl,
        productDescription: productDescription,
      }),
    });
    let newPhoto = await res.json();
    if (res.status !== 200) {
      setError(newPhoto);
    } else {
      setRestoredImage(newPhoto);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1300);
  }

  const renderGeneratedImages = () => {
    return restoredImage.map((img: string) => {
      return (
        <Image
          key={img}
          alt="restored photo"
          src={img}
          className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in h-auto"
          width={475}
          height={450}
        />
      );
    });
  };

  const downloadAllPhotos = () => {
    restoredImage.forEach((img: string) => {
      downloadPhoto(img!, appendNewToName(photoName!));
    });
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/Generate',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

  }

  const showUploader = !originalPhoto && !loading && restoredImage.length === 0;
  if (isChecking) {
    return <div className='mt-5 text-3xl text-center'>Loading...</div>
  }

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />

      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        {!isLoggedIn ?
          (
            <>
              <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-100 sm:text-6xl mb-5">Redesign your <span className="text-blue-600">Product</span> in seconds</h1>
              <div className='h-[250px] flex flex-col items-center space-y-6 max-w-[670px]'>
                <div className="max-w-xl text-gray-300 text-center">Sign in to redesign your product. You will get 4 generations in a day.</div>
                <button
                  className="bg-blue-600 rounded-xl text-white font-medium px-5 py-2 mt-4 hover:bg-blue-500 transition self-center"
                  onClick={signInWithGoogle}
                >
                  Log In
                </button>
              </div>

            </>
          ) : <>
            <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-100 sm:text-6xl mb-5">
              Generate your <span className="text-blue-600">Product</span>
            </h1>
            <AnimatePresence mode="wait">
              <motion.div className="flex justify-between items-center w-full flex-col mt-4">
                {restoredImage.length === 0 && (
                  <>
                    <div className="space-y-4 w-full max-w-sm">
                      <div>
                        <p className="text-left font-medium">
                          Describe your product in 2 or 3 words.
                        </p>
                      </div>
                      <input
                        placeholder="Ex: A Plant or A camera on a table"
                        type="text"
                        value={productDescription}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={(e) => setProductDescription(e.target.value)}
                      />
                    </div>
                    <div className="mt-4 w-full max-w-sm">
                      <div className="flex mt-6 w-96 items-center space-x-3">
                        <p className="text-left font-medium">
                          Upload a picture of your product. <br />
                          (Use transparent images for better results)
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {showUploader && <UploadDropZone />}
                {
                  originalPhoto && restoredImage.length === 0 && <Image
                    alt="restored photo"
                    src={originalPhoto}
                    className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in h-auto"
                    width={475}
                    height={450}
                  />
                }
                {restoredImage.length === 0 ? (
                  <button
                    disabled={!originalPhoto || !productDescription}
                    onClick={onGenerate}
                    className="bg-blue-500 rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 w-40"
                  >
                    <span className="pt-4">
                      {loading ? (
                        <LoadingDots color="white" style="large" />
                      ) : (
                        'Generate Images'
                      )}
                    </span>
                  </button>
                ) : null}


                {error && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8"
                    role="alert"
                  >
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                <div className="flex flex-wrap mt-10 justify-center gap-8">
                  {restoredImage?.length > 0 ? renderGeneratedImages() : null}
                </div>

                <div className="flex space-x-2 justify-center">
                  {restoredImage.length > 0 && !loading && (
                    <button
                      onClick={() => {
                        setOriginalPhoto(null);
                        setRestoredImage([]);
                        setError(null);
                      }}
                      className="bg-blue-500 rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-blue-500/80 transition"
                    >
                      Generate New Product
                    </button>
                  )}
                  {restoredImage.length > 0 && (
                    <button
                      onClick={() => {
                        downloadAllPhotos();
                      }}
                      className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-8 hover:bg-gray-100 transition"
                    >
                      Download Generated Products
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence></>}

      </main>
      <Footer />
    </div>
  );
}
