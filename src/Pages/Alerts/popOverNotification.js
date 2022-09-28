import React, { useState, useEffect, useRef } from 'react';
import moreIcon from "../../assets/images/more-vertical.svg";
import unread from "../../assets/images/unread-hamburger.svg";
import deleteNotification from "../../assets/images/delete-alerts.svg";
import manageNotification from "../../assets/images/settings-alerts.svg";

const PopOverNotification = () => {
    return (
        <div className="popover-notification">
            <div className="popover-alerts-header">
                <h3>Alerts</h3>
                <div className="popover-action-btn">
                    <img src={moreIcon} alt="" />
                    <div className="dropdown-actions">
                        <div>
                            <img src={unread} alt="" />
                            Mark as unread
                        </div>
                        <div>
                            <img src={manageNotification} alt="" />
                            Manage notifications
                        </div>
                    </div>
                </div>
            </div>
            <div className="popover-tab-wrapper">
                <ul>
                    <li className="selected">All</li>
                    <li>My Countries</li>
                    <li>General</li>
                    <li>Unread</li>
                </ul>
            </div>
            <div className="popover-notification-wrapper">
                <div className="alert-content-section">
                    <div className="alert-wrapper unread">
                        <h3>Argentina : Labor & Employment Update</h3>
                        <h6>Updates to benefits</h6>
                        <div className="round green">

                        </div>
                        <div className="time-section">
                            just now
                        </div>
                        <div className="moreicon">
                            <div className="dropdown-actions">
                                <div>
                                    <img src={unread} alt="" />
                                    Mark as unread
                                </div>
                                <div>
                                    <img src={deleteNotification} alt="" />
                                    Delete
                                </div>
                                <div>
                                    <img src={manageNotification} alt="" />
                                    Manage these notifications
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="alert-wrapper">
                        <h3>Argentina : Labor & Employment Update</h3>
                        <h6>Updates to benefits</h6>
                        <div className="time-section">
                            just now
                        </div>
                        <div className="moreicon">
                        </div>
                    </div>
                    <div className="alert-wrapper">
                        <h3>Argentina : Labor & Employment Update</h3>
                        <h6>Updates to benefits</h6>
                        <div className="time-section">
                            just now
                        </div>
                        <div className="moreicon">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PopOverNotification;

