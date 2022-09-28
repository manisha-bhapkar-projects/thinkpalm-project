import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { notifyTurnOff } from "../Store/reducers/notification";

export default function NotificationWrapper(props) {
    const dispatch = useDispatch();
    const state = useSelector(state => state.notification);
    const [notify, setNotify] = useState({})

    const removedNotify = () => {
        dispatch(notifyTurnOff({}))
    }

    useEffect(() => {
        if (state.title != "" || state.message != "") {

            setNotify({ ...state, active: true });
            setTimeout(() => {
                removedNotify();
            }, state.timeOut ? state.timeOut : state.defaultTimeOut);

        } else if (state.title === "" || state.message === "") {
            setNotify({ ...state, active: false });
        }
    }, [state]);

    return (
        <Fragment>
            <div>
                <div className={notify.active ? 'notification-message-trigger animate__animated animate__fadeInLeft' : 'notify-hidden'}>
                    {notify.message}
                    </div>
                {props.children}
            </div>
        </Fragment>
    )
}