

interface CardSectionProps {
  card1Image: string;
  card2Image: string;
  card3Image: string;
  card4Image: string;
}

const CardSection = ({ card1Image, card2Image, card3Image, card4Image }: CardSectionProps) => {
  const cards = [
    { id: 1, image: card1Image, alt: 'Card 1' },
    { id: 2, image: card2Image, alt: 'Card 2' },
    { id: 3, image: card3Image, alt: 'Card 3' },
    { id: 4, image: card4Image, alt: 'Card 4' },
  ];

  return (
    <section className="w-full py-12 bg-colorBlack950">
      <div className="px-6 md:px-32 container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card,index) => (
              <div key={card.id}
                   className="
                bg-white 
                shadow-lg 
                rounded-lg
                overflow-hidden 
                hover:scale-105
                transition-all duration-300 ease-in-out
                flex
                justify-center items-center
                relative
            ">
                <img
                    src={card.image}
                    alt={card.alt}
                    className="w-full h-auto object-cover "
                />
                <label className=' cursor-pointer z-50 absolute' htmlFor={`card${index+1}`}>
                  <div className='h-10 w-10 bg-white rounded-full text-black'>
                    <img className='rounded-full'
                         src="https://png.pngtree.com/png-clipart/20191121/original/pngtree-upload-vector-icon-with-transparent-background-png-image_5156946.jpg"
                         alt=""/>
                  </div>
                </label>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardSection;
