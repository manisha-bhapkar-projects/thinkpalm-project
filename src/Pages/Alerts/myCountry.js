import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertCard from './alertCard';


const pageFilters = {
    pageNumber: 1,
    pagesize: 10,
    countryId: 0,
    showContentAlertsOnly: false
};

function AlertCountryPage(props) {

    const { setLoadingAPI, getCountryAlerts, selectedCountryId } = props;
    const scrollContainer = useRef(null);
    const endContainer = useRef(null);
    const [apiCalling, setApiCalling] = useState(false);
    const [allPageFilters, setAllPageFilters] = useState({ ...pageFilters });
    const [dataLoading, setDataLoading] = useState(false);
    const [alertsList, setAlertsList] = useState([]);
    const [deletedList, setDeletedList] = useState([]);
    const [canCallAPI, setCanCallAPI] = useState(true);
    const [noAlerts, setNoAlerts] = useState(false);

    const {
        userCountryLoading,
        countryList
    } = useSelector(state => state.country);

    useEffect(() => {
        if (selectedCountryId) {
            const APIFilters = {
                ...pageFilters,
            };

            const countryId = selectedCountryId.filter((c) => c != 'all' && c != 'contentAlerts');
            if (countryId.length > 0) {
                if (selectedCountryId.includes('contentAlerts')) {
                    APIFilters.countryId = false;
                    APIFilters.showContentAlertsOnly = true;
                } else {
                    APIFilters.showContentAlertsOnly = false;
                    APIFilters.countryId = countryId.join(',');
                }
                setNoAlerts(false);
                setCanCallAPI(true);
                setAlertsList([]);
                setAllPageFilters(APIFilters);
            } else {
                setNoAlerts(false);
                setCanCallAPI(true);
                setAlertsList([]);
                setAllPageFilters(APIFilters);
            };

        }
    }, [selectedCountryId]);

    useEffect(() => {
        if ((apiCalling && !dataLoading) || props.isTestCase) {
            const APIFilters = {
                ...allPageFilters,
                pageNumber: allPageFilters.pageNumber + 1
            };
            const countryId = selectedCountryId.filter((c) => c != 'all' && c != 'contentAlerts');
            if (selectedCountryId && countryId.length > 0) {
                if (selectedCountryId.includes('contentAlerts')) {
                    APIFilters.countryId = false;
                    APIFilters.showContentAlertsOnly = true;
                } else {
                    APIFilters.showContentAlertsOnly = false;
                    APIFilters.countryId = countryId.join(',');
                }
            };

            setAllPageFilters(APIFilters);
        }
    }, [apiCalling]);

    useEffect(() => {
        const getAllList = async () => {
            setDataLoading(true);
            let _list = await getCountryAlerts(allPageFilters);
            if (_list.error) {
                props.notify('Failed to load Alerts!');
            } else {
                const { data, data: { totalCount } } = _list;
                if (data && data.data.length > 0) {
                    if (totalCount <= [...alertsList, ...data.data].length) {
                        setCanCallAPI(false);
                    }
                    setAlertsList([...alertsList, ...data.data]);
                    setDataLoading(false);
                } else {
                    setDataLoading(false);
                    setCanCallAPI(false);
                    setNoAlerts(true);
                }
            }
        }

        getAllList();
    }, [allPageFilters]);


    useEffect(() => {
        function getDocHeight() {
            var D = document;
            if (D && D.body && D.documentElement) {
                return Math.max(
                    D.body.scrollHeight, D.documentElement.scrollHeight,
                    D.body.offsetHeight, D.documentElement.offsetHeight,
                    D.body.clientHeight, D.documentElement.clientHeight
                );
            }

            return 0;
        }

        if (canCallAPI && !dataLoading) {
            if (window.scrollY + window.innerHeight == getDocHeight()) {
                if (!apiCalling) {
                    setApiCalling(true);
                }
            } else {
                setApiCalling(false);
            }
        }
    }, [props.currentPosition]);

    return (
        <div className={`alert-content-section ${alertsList.length > 0 && 'enable-border'}`} data-testid="my-country-page-container">
            {
                alertsList.map((item, i) => {
                    return (
                        <div key={i + 1}>
                            <AlertCard
                                {...props}
                                index={i + 1}
                                item={item}
                                callListAPI={() => { }}
                                deletedList={deletedList}
                                setDeletedList={setDeletedList}
                                setLoadingAPI={setLoadingAPI}
                                alertsList={alertsList} />
                        </div>
                    )
                })
            }
            {(noAlerts && alertsList.length === 0) && <div className='no-alerts'>No Alerts to display</div>}
            {dataLoading && <div className='loader-container'><div className='loading-alerts'></div></div>}
        </div>
    );
}

export default React.memo(AlertCountryPage);