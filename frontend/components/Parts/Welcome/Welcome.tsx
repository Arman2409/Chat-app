import {Typography} from "antd";
import {useMediaQuery} from "react-responsive";
import React, {useState, useEffect} from "react";

import styles from "../../../styles/Welcome/Welcome.module.scss";
import handleGQLRequest from "../../../request/handleGQLRequest";
import {getSlicedWithDots} from "../../../functions/functions";
import NewsModal from "./NewsModal/NewsModal";
import Loading from "../../Custom/Loading/Loading";

const Welcome: React.FunctionComponent = () => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [modalData, setModalData] = useState<any>();
    const isSmall = useMediaQuery({query: "(max-width: 481px)"});

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
                width: isSmall ? "100%" : "50%",
            }}>
            {loading && <Loading/>}
            {modalData &&
                <NewsModal news={news[0]} toggleModal={toggleModal}/>
            }
            <div className="border_div"></div>
            <div className={styles.welcome_content}>
                <Typography>
                    Welcome to Talk Space
                </Typography>
                <p className={styles.welcome_description}>
                    One of the best ways to communicate with your friends from all around the world
                </p>
                <h5 className={styles.welcome_news}>
                    News
                </h5>
                <div className={styles.news_cont}>
                    {news.map((e, index) => (
                        <div key={index} className={styles.one_news_cont} onClick={() => toggleModal(e)}>
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