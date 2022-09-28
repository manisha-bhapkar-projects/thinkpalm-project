import React, { useState, useRef, useEffect } from 'react';
import unread from "../../assets/images/unread-hamburger.svg";
import deleteNotification from "../../assets/images/delete-alerts.svg";
import manageNotification from "../../assets/images/settings-alerts.svg";

import constants from "../../utils/constants";
import moment from 'moment';
import { cloneDeep } from 'lodash';

const AlertCard = (props) => {
    const wrapperRef = useRef(null);
    const { item, index, deletedList, setDeletedList, markAsRead, deleteAlertItem, setLoadingAPI, history, callListAPI } = props;
    const [handleClickMore, setHandleClickMore] = useState(false);
    const [alert, setAlert] = useState();

    useEffect(() => {
        setAlert(item)
    }, [item])

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, false);
        return () => {
            document.removeEventListener("click", handleClickOutside, false);
        };
    }, []);

    const onOutsideClickMore = ({ target }) => {
        const hideClassNames = ['time-section', 'alert-name', 'alert-desc', 'alert-wrapper read', 'alert-wrapper unread'];
        if (handleClickMore && hideClassNames.includes(target.className)) {
            setHandleClickMore(false);
        }
    }

    const MoreContainer = (props) => {
        const { item } = props;
        return (
            <div className="dropdown-actions ">
                <div className='mark-read' data-testid="mark-read" onClick={() => props.MarkAsRad(alert?.id,
                    !alert?.isRead)
                } >
                    <img src={unread} alt="" />
                    Mark as {alert?.isRead ? 'unread' : 'read'}
                </div>
                <div className='delete' data-testid="delete-item" onClick={() => props.onDelete(alert?.id, true)} >
                    <img src={deleteNotification} alt="" />
                    Delete
                </div>
                <div className="manage-notify" data-testid="manage-notify" onClick={props.manageNotify} >
                    <img src={manageNotification} alt="" />
                    Manage these notifications
                </div>
            </div>
        )
    };

    /** This is for closing the MoreContainer while clicking outside of the MoreContainer box */
    const handleClickOutside = event => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setHandleClickMore(false);
        }
    };

    const onMarkAsRead = async (id, status) => {
        setLoadingAPI(true);
        setHandleClickMore(false);
        if (id) {
            const response = await markAsRead({ id, status });
            if (response?.error) {
                console.log('response error', response);
                props.notify(response.message || "Failed to update alert read status.");
            } else if (response?.responseCode === 200) {
                const tempAlert = cloneDeep(alert);
                tempAlert.isRead = status
                setAlert(tempAlert);
                // if (status) {
                //     setMarkAsReadItem([...markAsReadItem, id]);
                // } else {
                //     setMarkAsReadItem([...markAsReadItem.filter(a => a != id)]);
                // }
                props.notify(response.message || "Successfully updated alert read status.");
                callListAPI()
            }
        } else {
            props.notify("Alert is not valid.");
        }
        setLoadingAPI(false);
    }

    const onDeleteAlert = async (id, status) => {
        setLoadingAPI(true);
        setHandleClickMore(false);
        const response = await deleteAlertItem({ id, status });
        if (response?.error) {
            props.notify(response.message || "Failed to delete alert.");
        } else if (response?.data === null) {
            if (status) {
                setDeletedList([...deletedList, id]);
            } else {
                setDeletedList([...deletedList.filter((_alert) => _alert != id)]);
            }
            callListAPI()
            if (status) {
                props.notify(response.message || "Successfully deleted alert.");
            }
        }
        setLoadingAPI(false);
    }

    const manageNotify = async () => {
        setHandleClickMore(false);
        history.push(constants.ROUTE.KNOWLEDGE_BASE.MANAGE_ALERTS)
    }

    const getHoursFormatted = ({ createdAt }) => {
        let difference = new Date().getTime() - new Date(moment(createdAt).utc()).getTime();

        let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        difference -= daysDifference * 1000 * 60 * 60 * 24

        let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
        difference -= hoursDifference * 1000 * 60 * 60

        let minutesDifference = Math.floor(difference / 1000 / 60);
        difference -= minutesDifference * 1000 * 60

        if (daysDifference > 1) {
            return daysDifference + ' ' + 'days';
        } else if (daysDifference > 0) {
            return daysDifference + ' ' + 'day';
        } else if (hoursDifference > 0) {
            return hoursDifference + ' ' + 'hours ago';
        } else if (minutesDifference > 1) {
            return minutesDifference + ' ' + 'minutes ago';
        } else if (minutesDifference >= 0) {
            return 'just now';
        }
    }

    return (
        <div ref={wrapperRef}>
            {
                deletedList.length > 0 && deletedList.includes(alert?.id) ?
                    <div className='alert-deleted-container'>
                        <div className='alert-deleted-section'>
                            <div className='alert-deleted-title'>Notification deleted</div>
                            <div className='alert-undo' onClick={() => onDeleteAlert(alert?.id, false)}>Undo</div>
                        </div>
                    </div>
                    : <div
                        data-item={index}
                        className={`alert-wrapper ${(alert?.isRead) ? 'read' : 'unread'}`}
                        onClick={onOutsideClickMore}
                    >
                        <h3 data-testid="click-outside-popup" className='alert-name' onClick={() => {
                            if (!handleClickMore && !alert?.isRead) onMarkAsRead(alert?.id, true);
                        }}>{alert?.alertTitle}</h3>
                        <h6 className='alert-desc' onClick={() => {
                            if (!handleClickMore && !alert?.isRead) onMarkAsRead(alert?.id, true);
                        }}>{alert?.alertDescription}</h6>
                        <div className={`round ${alert?.severity === 1 ? 'red' : alert?.severity === 2 ? 'orange' : 'green'}`} />
                        <div className="time-section">
                            {getHoursFormatted(item)}
                        </div>
                        <div className="moreicon" data-testid="more-popup" onClick={({ target }) => {
                            if (target.className === "moreicon") setHandleClickMore(!handleClickMore);
                        }}>
                            {handleClickMore && (
                                <MoreContainer
                                    {...props}
                                    item={item}
                                    MarkAsRad={onMarkAsRead}
                                    onDelete={onDeleteAlert}
                                    manageNotify={manageNotify}
                                />)}
                        </div>
                    </div>
            }
        </div>
    );
}

export default React.memo(AlertCard);