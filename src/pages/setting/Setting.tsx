import {useGetImageQuery} from "@/features/api/imageSlice.ts";
import ErrorFetching from "@/components/common/ErrorFetching.tsx";
import CLoader from "@/components/common/CLoader.tsx";
import {useUpdateImageMutation} from "@/features/api/imageUploadSlice.ts";
import HeroSection from "@/pages/setting/HomeComponents/HeroSection/HeroSection.tsx";
import MembershipSection from "@/pages/setting/HomeComponents/MembershipSection/MembershipSection.tsx";
import ShopNowSection from "@/pages/setting/HomeComponents/ShopNowSection/ShopNowSection.tsx";
import GiftSection from "@/pages/setting/HomeComponents/GiftSection/GiftSection.tsx";
import CategorySection from "@/pages/setting/HomeComponents/CategorySection/CategorySection.tsx";
import AccessoriesSection from "@/pages/setting/HomeComponents/AccessoriesSection/AccessoriesSection.tsx";
import BestSaleSection from "@/pages/setting/HomeComponents/BestSaleSection/BestSaleSection.tsx";
import CardSection from "@/pages/setting/HomeComponents/CardSection/CardSection.tsx";

const Setting = () => {
    const {
        data: Images,
        isLoading: getImageIsLoading,
        isFetching: getImageIsFetching,
        error: getImageError,
        refetch,
    } = useGetImageQuery();

    const [imageUpdate, {isLoading, error}] = useUpdateImageMutation();

    const getImageBySection = (section: string) => {
        const image = Images?.find((img) => img.section === section);
        return image ? image.imageUrl : ''; // Return the URL if found, otherwise an empty string
    };

    const handelUpdateImage = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;

        const updateImageData = new FormData();
        updateImageData.append("section", e.target.name);
        updateImageData.append("image", file);


        try {
            const result = await imageUpdate(updateImageData).unwrap();

            console.log("success");
            refetch();
        } catch (error) {
            console.log("Image update failed");
            console.error(error);
        }
    }

    if (getImageIsLoading || getImageIsFetching || isLoading) {
        return (
            <div className="h-[80vh] w-full flex justify-center items-center">
                <CLoader/>
            </div>
        );
    }

    if (getImageError || error) {
        return (
            <div className="h-[80vh] w-full flex justify-center items-center">
                <ErrorFetching/>
            </div>
        );
    }

    return (
        <div>
            <>
                <HeroSection heroImage={getImageBySection('hero')} backgroundImage={getImageBySection('heroBg')}/>
                <CategorySection categoryImage={getImageBySection('categoryBg')}/>
                <BestSaleSection/>
                <CardSection card1Image={getImageBySection('card1')} card2Image={getImageBySection('card2')}
                             card3Image={getImageBySection('card3')} card4Image={getImageBySection('card4')}
                />

                {/* First Promotional Section */}
                <section className="w-full bg-colorBlack950">
                    <div className=" mx-auto relative flex justify-center items-center">
                        <img
                            src={getImageBySection('promo1')} // Dynamically load banner image
                            alt="Promotional Image"
                            className="w-full h-auto object-cover shadow-lg"
                        />
                        <label className=' cursor-pointer z-50 absolute ' htmlFor="promo1">
                            <div className='h-10 w-10 bg-white rounded-full text-black'>
                                <img className='rounded-full'
                                     src="https://png.pngtree.com/png-clipart/20191121/original/pngtree-upload-vector-icon-with-transparent-background-png-image_5156946.jpg"
                                     alt=""/>
                            </div>
                        </label>
                    </div>
                </section>

                <AccessoriesSection/>
                <MembershipSection backgroundImage={getImageBySection('memberBg')}/>
                <ShopNowSection shopImage={getImageBySection('shopWine')}
                                spiritImage={getImageBySection('shopSpirits')}/>
                <GiftSection/>

                {/* Second Promotional Section with Two Images */}
                <section className="w-full h-[460px] bg-colorBlack950">
                    <div className="relative container mx-auto flex flex-col md:flex-row">
                        <img
                            src={getImageBySection('promo2')} // Dynamically load promotion image
                            alt="Promotional Image"
                            className="w-full md:w-1/2 h-[460px] object-cover shadow-lg"
                        />
                        <img
                            src={getImageBySection('promo3')} // Dynamically load another promotion image
                            alt="Promotional Image"
                            className="w-full md:w-1/2 h-[460px] object-cover shadow-lg"
                        />
                        <div className='absolute flex justify-around h-full items-center w-full'>
                            <label className=' cursor-pointer z-50 ' htmlFor="promo2">
                                <div className='h-10 w-10 bg-white rounded-full text-black'>
                                    <img className='rounded-full'
                                         src="https://png.pngtree.com/png-clipart/20191121/original/pngtree-upload-vector-icon-with-transparent-background-png-image_5156946.jpg"
                                         alt=""/>
                                </div>
                            </label>
                            <label className=' cursor-pointer z-50 ' htmlFor="promo3">
                                <div className='h-10 w-10 bg-white rounded-full text-black'>
                                    <img className='rounded-full'
                                         src="https://png.pngtree.com/png-clipart/20191121/original/pngtree-upload-vector-icon-with-transparent-background-png-image_5156946.jpg"
                                         alt=""/>
                                </div>
                            </label>
                        </div>
                    </div>
                </section>
            </>

            {
                Images?.map((image) => (
                    <input key={image.section} onChange={handelUpdateImage} className='hidden' type="file"
                           name={image.section} id={image.section}/>
                ))
            }
        </div>
    );
};

export default Setting;
