import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import constants from "../../../utils/constants";
import Loader from "../../../Components/Loader";



const firstIndex = 1;

const getBreakPoint = () => {
    // return total columns to show for each breakpoint
    let screenWidth = window.screen.width
    if (screenWidth >= 1224) {
        return 5
    }
    else if (screenWidth >= 1000) {
        return 4
    }
    else return 3
}

export default function App(props) {
    const { countries = [], countryDetails = [], attributes = [], attributeLabels = [], loading } = props

    const [visibleElmIndex, setVisibleElmIndex] = useState(firstIndex);
    const [columnWidth, setColumnWidth] = useState(194)

    const handleWindowResize = (...data) => {
        let parent = document.getElementById("table-container");
        let { width } = parent.getBoundingClientRect();
        setColumnWidth(width / getBreakPoint())
        setVisibleElmIndex(firstIndex)
        parent.scrollTo(0, 0)
    }
    useEffect(() => {
        let parent = document.getElementById("table-container");
        let { width } = parent.getBoundingClientRect();
        setColumnWidth(width / getBreakPoint())

        window.addEventListener("resize", handleWindowResize)
        return function cleanup() {
            window.removeEventListener("resize", handleWindowResize)
        }
    }, [])
    const onVisibleChange = (isInc) => {
        if (visibleElmIndex <= firstIndex && !isInc) return;
        if (isInc) {
            let element = document.getElementById(`column_${visibleElmIndex}`);
            if (!document.getElementById(`column_${visibleElmIndex + 1}`)) return;
            setVisibleElmIndex(visibleElmIndex + 1);
            let parent = document.getElementById("table-container");
            let { width } = element.getBoundingClientRect();
            parent.scrollBy({
                left: width,
                behavior: "smooth"
            });
        } else {
            let element = document.getElementById(`column_${visibleElmIndex}`);
            if (!document.getElementById(`column_${visibleElmIndex - 1}`)) return;
            setVisibleElmIndex(visibleElmIndex - 1);
            let parent = document.getElementById("table-container");
            let { width } = element.getBoundingClientRect();
            parent.scrollBy({
                left: -width,
                behavior: "smooth"
            });
        }
    };
    return (
        <div className={styles.container} data-test="table">
            {
                loading && (
                    <div className="white-overlay">
                        <div className="msg-wrapper-loader">
                            <Loader />
                        </div>
                    </div>
                )
            }
            {countries?.length>=5?
                (<div >
                <button className={`${styles.greater} ${styles.fixed} ${styles.nextBtn}`} onClick={() => onVisibleChange(false)} data-test="country">

                </button>
                <button className={`${styles.lesser} ${styles.prevBtn}`} onClick={() => onVisibleChange(true)} data-test="country1">

                </button>
            </div>):""}
            <div className={styles.table_container} id="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: columnWidth }} className={`${styles.fixed}`}>Snapshot</th>
                            {countries?.map((item, index) => (
                                <th
                                    style={
                                        index === 0 ?
                                            { width: columnWidth, left: columnWidth }
                                            : { width: columnWidth }
                                    }
                                    id={`column_${index}`}
                                    className={index === 0 ? styles.fixed : ""}
                                    key={index}
                                >
                                    <img alt="" src={`${constants.IMAGE.DOWNLOAD}${item.flag_Upload_Id}`} />
                                    {item.country_Name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>

                        {attributeLabels.map((item, index) => (

                            <tr key={index}>

                                <td style={{ width: columnWidth }} className={`${styles.fixed}`}>

                                    {item}

                                </td>

                                {countries?.map((country, i) => {


                                    let country_id = country.id


                                    let detail = countryDetails.find(data => data.countryId === country_id && data.supertopicName === attributes[index])
                                  
                                    return (
                                        <td
                                            style={
                                                i === 0 ?
                                                    { width: columnWidth, left: columnWidth }
                                                    : { width: columnWidth }
                                            }
                                            className={i === 0 ? styles.fixed : ""} key={i}
                                            dangerouslySetInnerHTML={{
                                                __html: (detail?.supertopicName === "Taxes" ?
                                                    detail?.topics ?
                                                        detail?.topics.map((item => item?.topicName === "Social Security & Payroll Taxes" ? item?.topicSnapshotContent?.join(";")?.replace(/^,/, '') : ""))?.join('')
                                                        : "No data"
                                                    : detail?.superTopicSnapshotContent ? detail?.superTopicSnapshotContent?.join(";")
                                                        : "No data")
                                                    || "No data"
                                            }}
                                        >
                                        </td>
                                    )
                                })
                                }

                            </tr>
                        ))
                        }




                    </tbody>
                </table>
            </div>
        </div>
    );
}
