import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';
import { Popover, OverlayTrigger } from "react-bootstrap"

import { tileProps } from './shared/propTypes';

function getValue(nextProps, prop) {
  const { activeStartDate, date, view } = nextProps;

  return typeof prop === 'function'
    ? prop({ activeStartDate, date, view })
    : prop;
}

export default class Tile extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { tileClassName, tileContent } = nextProps;

    const nextState = {};

    if (tileClassName !== prevState.tileClassNameProps) {
      nextState.tileClassName = getValue(nextProps, tileClassName);
      nextState.tileClassNameProps = tileClassName;
    }

    if (tileContent !== prevState.tileContentProps) {
      nextState.tileContent = getValue(nextProps, tileContent);
      nextState.tileContentProps = tileContent;
    }

    return nextState;
  }

  state = {};

  popover = (events) => {
    return (
      <Popover id="popover-basic">
        {/* <Popover.Title as="h3">Holidays</Popover.Title> */}
        <Popover.Content>
          {events?.length ?
            events.map(item => (
              <li>{item.description}</li>
            ))
            : null}
        </Popover.Content>
      </Popover>
    )

  }

  render() {
    const {
      activeStartDate,
      children,
      classes,
      date,
      formatAbbr,
      locale,
      maxDate,
      maxDateTransform,
      minDate,
      minDateTransform,
      onClick,
      onMouseOver,
      style,
      tileDisabled,
      view,
      events
    } = this.props;
    const { tileClassName, tileContent } = this.state;
    return (
      <>
        {events?.length ?

          <OverlayTrigger defaultShow={false}
            trigger="hover" overlay={this.popover(events)}>

            <button
              className={mergeClassNames(classes, tileClassName)}
              disabled={
                (minDate && minDateTransform(minDate) > date)
                || (maxDate && maxDateTransform(maxDate) < date)
                || (tileDisabled && tileDisabled({ activeStartDate, date, view }))
              }
              onClick={onClick && ((event) => onClick(date, event))}
              onFocus={onMouseOver && (() => onMouseOver(date))}
              onMouseOver={onMouseOver && (() => onMouseOver(date))}
              style={style}
              type="button"
            >

              {formatAbbr
                ? (
                  <abbr className="calendar-tile-color" aria-label={formatAbbr(locale, date)}>
                    {children}
                  </abbr>
                )
                : children}
              {tileContent}
              {events?.length ?
                <span className="holiday-notify"></span>
                : null}

            </button>
          </OverlayTrigger>
          : <button
            className={mergeClassNames(classes, tileClassName)}
            disabled={
              (minDate && minDateTransform(minDate) > date)
              || (maxDate && maxDateTransform(maxDate) < date)
              || (tileDisabled && tileDisabled({ activeStartDate, date, view }))
            }
            onClick={onClick && ((event) => onClick(date, event))}
            onFocus={onMouseOver && (() => onMouseOver(date))}
            onMouseOver={onMouseOver && (() => onMouseOver(date))}
            style={style}
            type="button"
          >

            {formatAbbr
              ? (
                <abbr aria-label={formatAbbr(locale, date)}>
                  {children}
                </abbr>
              )
              : children}
            {tileContent}
            {events?.length ?
              <span className="holiday-notify"></span>
              : null}

          </button>}
      </>
    );
  }
}

Tile.propTypes = {
  ...tileProps,
  children: PropTypes.node.isRequired,
  formatAbbr: PropTypes.func,
  maxDateTransform: PropTypes.func.isRequired,
  minDateTransform: PropTypes.func.isRequired,
};
