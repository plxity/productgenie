import Image from 'next/image';
import { EXAMPLES } from './constant'

function Examples() {

  const renderExamples = () => {
    return EXAMPLES.map(ex => {
      const { afterImg, beforeImg, name } = ex;
      return (
        <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6" key={name}>
          <div className="flex flex-col space-y-10 mt-4 mb-16">
            <div className="flex sm:space-x-8 sm:flex-row flex-col">
              <div>
                <h3 className="mb-1 font-medium text-lg text-center">Original Product</h3>
                <Image
                  alt={`Original photo of a ${name}`}
                  src={beforeImg}
                  className="w-full object-cover h-96 rounded-2xl bg-white"
                  width={400}
                  height={400}
                />
              </div>
              <div className="sm:mt-0 mt-8">
                <h3 className="mb-1 font-medium text-lg text-center">Generated Product</h3>
                <Image
                  alt={`Generated photo of a ${name} with productgenie`}
                  width={400}
                  height={400}
                  src={afterImg}
                  className="w-full object-cover h-96 rounded-2xl sm:mt-0 mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      )
    })
  }
  return <main className='mt-8'>
    <h2 className='text-center text-5xl'>Examples</h2>
    <div className="flex mt-6 flex-col">
      {renderExamples()}
    </div>
  </main>
}

export default Examples;