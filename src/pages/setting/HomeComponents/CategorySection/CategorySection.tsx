

const categories = [
  'Red Wine',
  'White Wine',
  'Rose Wine',
  'Champagne & Sparkling',
  'Sake',
  'Spirits',
  'Cans & Cocktails',
];

const CategorySection = ({ categoryImage }: { categoryImage: string }) => {
 
  return (
      <section
          className="w-full h-auto bg-cover bg-center py-8"
          style={{backgroundImage: `url('${categoryImage}')`}}
      >
        <div className="container mx-auto px-6 flex flex-wrap justify-center gap-6">
          {categories.map((category, index) => (
              <button
                  // onClick={() => navigate(`shop#${category.replace(" ", "")}`, { state: { navigateCategory: category } })}
                  key={index}
                  className="
        category-button
        w-auto h-auto
        px-[30px] py-[15px]
        bg-transparent
        border-colorBlack950 border-1
        rounded-full
        hover:scale-105
        transition-all duration-300 ease-in-out
        opacity-100
        border-2
        border-[#442604]
        "
              >
                {category}
              </button>
          ))}
        </div>
        <label className=' cursor-pointer z-50 float-end me-10 mb-10 ' htmlFor="categoryBg">
          <div className='h-10 w-10 bg-white rounded-full text-black'>
            <img className='rounded-full'
                 src="https://png.pngtree.com/png-clipart/20191121/original/pngtree-upload-vector-icon-with-transparent-background-png-image_5156946.jpg"
                 alt=""/>
          </div>
        </label>
      </section>
  );
};

export default CategorySection;
