import React, { useState, useEffect, useRef } from 'react';
import AlertCard from './alertCard';

import debounce from 'lodash.debounce';

const pageFilters = {
    pageNumber: 1,
    pagesize: 10
};

function AlertAllPage(props) {

    const { setLoadingAPI, getAllAlerts } = props;
    const scrollContainer = useRef(null);
    const endContainer = useRef(null);
    const [apiCalling, setApiCalling] = useState(false);
    const [allPageFilters, setAllPageFilters] = useState({ ...pageFilters });
    const [dataLoading, setDataLoading] = useState(false);
    const [alertsList, setAlertsList] = useState([]);
    const [deletedList, setDeletedList] = useState([]);
    const [canCallAPI, setCanCallAPI] = useState(true);
    const [noAlerts, setNoAlerts] = useState(false);

    useEffect(() => {
        updatePageFilter();
    }, [apiCalling]);

    const updatePageFilter = debounce(() => {
        if (apiCalling && !dataLoading) {
            const APIFilters = {
                ...allPageFilters,
                pageNumber: allPageFilters.pageNumber + 1
            };
            setAllPageFilters(APIFilters);
        }
    }, 100);

    useEffect(() => {
        const getAllList = async () => {
            setDataLoading(true);
            let _list = await getAllAlerts(allPageFilters);
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

        if (canCallAPI) {
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
        <div className={`alert-content-section ${alertsList.length > 0 && 'enable-border'}`} data-testid="all-page-container">
            {
                alertsList.map((item, i) => {
                    return (
                        <div key={item.id + '_' + 1}>
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

export default React.memo(AlertAllPage);