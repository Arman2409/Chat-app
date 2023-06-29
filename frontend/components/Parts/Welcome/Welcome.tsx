import {Typography} from "antd";
import {useMediaQuery} from "react-responsive";
import React, {useState, useEffect, lazy, Suspense} from "react";

const NewsModal = lazy(() => import("./NewsModal/NewsModal"));
import styles from "../../../styles/Parts/Welcome.module.scss";
import handleGQLRequest from "../../../request/handleGQLRequest";
import {getSlicedWithDots} from "../../../functions/functions";
import Loading from "../../Custom/Loading/Loading";

const Welcome: React.FunctionComponent = () => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalData, setModalData] = useState<any>();

    const isMedium = useMediaQuery({query: "(max-width: 750px)"});
    const isSmall = useMediaQuery({query: "(max-width: 600px)"});

    const toggleModal: Function = (news: any) => {
        setModalData(news);
    };

    useEffect(() => {
        (async function () {
            setLoading(true);
            const data = await handleGQLRequest("GetWelcomeNews");
            if (data) {
                if (data.GetWelcomeNews) {
                    if (data.GetWelcomeNews.errors) {
                        setNews([]);
                    } else if (data.GetWelcomeNews) {
                        setNews(data.GetWelcomeNews);
                    }
                }
                setLoading(false);
            } else {
                setLoading(false);
                setNews([]);
            }
        })()
    }, [])

    return (
        <div
            className={styles.welcome_cont}
            style={{
                width: isSmall ? "100%" : isMedium ? "40%" :  "50%",
            }}>
            {loading && <Loading/>}
            {modalData &&
             <Suspense fallback={""}>
                <NewsModal news={news[0]} toggleModal={toggleModal}/>
             </Suspense>
            }
            <div className="border_div"></div>
            <div className={styles.welcome_content}>
                <Typography style={{
                    fontSize: isMedium ? "30px" : "40px"
                }}>
                    Welcome to Talk Space
                </Typography>
                <p className={styles.welcome_description} style={{
                    fontSize: isMedium ? "20px" : "25px"
                }}>
                    One of the best ways to communicate with your friends from all around the world
                </p>
                <h5 className={styles.welcome_news}>
                    News
                </h5>
                <div className={styles.news_cont}>
                    {news.map((e, index) => (
                        <div
                           data-testid="news-cont"
                           key={index}
                           className={styles.one_news_cont} 
                           onClick={() => toggleModal(e)}>
                            <h3 className={styles.one_news_cont_title}>
                                {getSlicedWithDots(e.title, 10)}
                            </h3>
                            <p className={styles.one_news_cont_desc}>
                                {getSlicedWithDots(e.description, 15)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default Welcome;