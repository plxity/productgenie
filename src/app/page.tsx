import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Card from './components/Card';
import SquigglyLines from "./components/SquigglyLines";
import { cardDetails } from './constants';

export default function HomePage() {
  const renderCards = () => {
    return cardDetails.map((cardInfo, index) => {
      return <Card {...cardInfo} key={index} />
    })
  }
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-20 mt-20 background-gradient">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-gray-300 sm:text-7xl">
          Create stunning product images
          <span className="relative whitespace-nowrap text-blue-600">
            <SquigglyLines />
            <span className="relative"> using AI</span>
          </span>
        </h1>
        <h2 className="mx-auto mt-12 max-w-xl text-lg sm:text-gray-400  text-gray-500 leading-7">
          With ProductGenie, you can effortlessly generate eye-catching product images using AI technology.
        </h2>
        <Link
          className="bg-blue-600 rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-blue-500 transition"
          href="/Generate"
        >
          Generate Product Images
        </Link>
        <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
          <div className="flex flex-col space-y-10 mt-4 mb-10">
            <div className="flex sm:space-x-8 sm:flex-row flex-col">
              <div>
                <h3 className="mb-1 font-medium text-lg">Original Product</h3>
                <Image
                  alt="Original photo of a camera"
                  src="/examples/Camera/before.png"
                  className="w-full object-cover h-96 rounded-2xl bg-white"
                  priority={true}
                  width={400}
                  height={400}
                />
              </div>
              <div className="sm:mt-0 mt-8">
                <h3 className="mb-1 font-medium text-lg">Generated Product</h3>
                <Image
                  alt="Generated photo of a camera with productgenie"
                  priority={true}
                  width={400}
                  height={400}
                  src="/examples/Camera/after.jpg"
                  className="w-full object-cover h-96 rounded-2xl sm:mt-0 mt-2"
                />
              </div>
            </div>
          </div>
        </div>
        <Link
          className="bg-blue-600 flex rounded-xl text-white font-medium px-4 py-3 sm:my-10 my-8 hover:bg-blue-500 transition"
          href="/Showcase"
        >
          Checkout More examples
        </Link>
        <div className="flex justify-center md:justify-between gap-6 flex-grow-0 flex-wrap lg:flex-nowrap">
          {renderCards()}
        </div>
      </main>
      <Footer />
    </div>
  );
}
