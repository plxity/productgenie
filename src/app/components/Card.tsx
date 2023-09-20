const Card = ({ heading = '', subHeading = '', Icon }) => {
  return (
    <div className="max-w-sm  w-full lg:w-4/12 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-stone-950 dark:border-gray-700">
      <div className="flex justify-center">
        <Icon className="h-10 w-10" />
      </div>

      <h5 className="mb-2 mt-2 text-2xl font-semibold tracking-tight text-gray-200">{heading}</h5>
      {/* <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">{subHeading}</p> */}
    </div>
  )

}
export default Card
