
import {Card} from "@/components/ui/card.js";

const BestSaleSection = () => {
    return (<section
        className="w-full py-24 bg-white pointer-events-none"
        id="BestSale"
    >
        {/* Best Sale Heading */}
        <h2 className="text-center text-3xl font-Merriweather font-bold leading-lg">
            Best Sale
        </h2>

        {/* Card Grid */}
        <div
            className="px-6 md:px-32 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8 items-center justify-items-center">
            {[1, 2, 3, 4].map(() => (
                <Card
                    className="flex flex-col justify-around w-full max-w-[300px] h-[506px] cursor-pointer relative overflow-hidden card-custom-shadow border-0"
                    style={{padding: '12px'}}
                >
                    <div className="relative overflow-hidden group">
                        <img
                            alt='ks'
                            src={'https://www.alkovintages.com/wp-content/uploads/2019/09/dry-red.png'}
                            className="w-full h-[322px] transition-transform duration-300 ease-in-out transform group-hover:scale-150"
                        />

                    </div>
                    <div
                        className="absolute top-10 right-0 w-[200px] bg-[#FF4976] text-white px-4 py-1 text-center text-sm font-bold transform rotate-45 translate-x-[30%] translate-y-[-30%]">
                        Best Sale
                    </div>
                    {/* <Link to={`/single-product/${id}`}> */}
                    <div className="flex flex-col gap-1">
                        <h3 className="font-Merriweather text-lg font-bold leading-[22.63px] mb-1">NAME</h3>
                        <p className="font-Merriweather text-sm font-normal leading-[17.6px] text-gray-600 mb-2">
                            USA
                        </p>
                        <div className="flex items-center">
                            <span
                                className="font-Merriweather text-lg font-bold leading-[22.63px] text-[#FF4976] mr-2">
                               $100
                            </span>
                            <span
                                className="font-Merriweather text-lg font-bold leading-[22.63px] text-gray-400 line-through">
                               $120
                             </span>
                        </div>
                    </div>
                    {/* </Link> */}
                </Card>))}
        </div>
    </section>)
};

export default BestSaleSection;
