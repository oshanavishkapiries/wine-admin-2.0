import CustomButton from "@/components/section/settings/CustomButton/CustomButton.tsx";

const ShopNowSection = ({ shopImage, spiritImage }: { shopImage: string,spiritImage: string }) => {

  return (
    <section className="w-full bg-colorBlack950">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Left Image with Text */}
        <div className="relative group">
          <img
              src={shopImage}
              alt="Shop Wine"
              className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 text-white flex flex-col gap-5 ms-5">
            <h3 className="text-4xl font-bold mb-2">Shop Wine</h3>
            <CustomButton text="Shop Now"/>
          </div>
          <label className=' cursor-pointer z-50 absolute right-10 bottom-10' htmlFor="shopWine">
            <div className='h-10 w-10 bg-white rounded-full text-black'>
              <img className='rounded-full'
                   src="https://png.pngtree.com/png-clipart/20191121/original/pngtree-upload-vector-icon-with-transparent-background-png-image_5156946.jpg"
                   alt=""/>
            </div>
          </label>
        </div>

        {/* Right Image with Text */}
        <div className="relative group">
          <img
              src={spiritImage}
              alt="Shop Spirit"
              className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4 text-white flex flex-col gap-5 me-5">
            <h3 className="text-4xl font-bold mb-2">Shop Spirit</h3>
            <CustomButton text="Shop Now"/>
          </div>
          <label className=' cursor-pointer z-50 absolute left-10 bottom-10' htmlFor="shopSpirits">
            <div className='h-10 w-10 bg-white rounded-full text-black'>
              <img className='rounded-full'
                   src="https://png.pngtree.com/png-clipart/20191121/original/pngtree-upload-vector-icon-with-transparent-background-png-image_5156946.jpg"
                   alt=""/>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
};

export default ShopNowSection;
