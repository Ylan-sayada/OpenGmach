import Head from 'next/head'
import { useRecoilValue } from 'recoil';
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import { sysConfig } from '../data/atoms/landingAtoms';
import styles from '../styles/Home.module.scss';

const Home = () => {
    const dataSysConfig = useRecoilValue(sysConfig)
    return (
        <div id={styles.Home}>
            <Head>
                <title>Welcome to {dataSysConfig.gmachDetails.gmachName} website!</title>
                <meta name="description" content="" />
                <link rel="icon" href="" />
            </Head>
            <header>
                <Swiper
                    modules={[Autoplay]}
                    slidesPerView={1}
                    spaceBetween={0}
                    autoplay={{
                        delay: 4500,
                        disableOnInteraction: false,
                    }}
                >
                    {dataSysConfig.headerImage?.map((imgLink, index) => {
                        return <SwiperSlide key={index} className={styles.header_img}>
                            <div className="img" style={{
                                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url(${imgLink})`
                            }}></div>
                        </SwiperSlide>
                    })}
                    <h3 className={styles.header_text}>{dataSysConfig.headerText}</h3>
                </Swiper>
            </header>
            <section >
                <h2>Our Actions</h2>
                <div className={styles.action_container}>
                    {
                        dataSysConfig.gmachAction?.map((element, index) => <div className={`${styles.action_gmach}`} key={index} >
                            <div className={`${styles.action_image}`} style={{ backgroundImage: `url(${element.actionImage})`, backgroundRepeat: "no-repeat" }}></div>
                            <div className={`${styles.action_txt_section}`}>
                                <p>
                                    <span className={`${styles.action_title}`}>{element.title}</span><br />
                                    <span className={`${styles.action_description}`} >{element.desc}</span>
                                </p>
                            </div>

                        </div>)
                    }
                </div>
            </section>


        </div>
    )
}

export default Home