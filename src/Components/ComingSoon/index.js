import React from 'react';
import party from "../../assets/images/party.png";

const ComingSoon = (props) => {
    let direction = props.direction;
  
    let arrow_direction = "arrow-top";
    if (direction == "top") {
        arrow_direction = "arrow-top"
    }
    if(direction == "bottom"){
        arrow_direction = "arrow-bottom"
    }
    if(direction == "left"){
        arrow_direction = "arrow-left"
    }
    if(direction == "right"){
        arrow_direction = "arrow-right"
    }
    
    return (
        <div className={`tooltip_coimgsoon ${direction}` } data-test="comingSoon">
            <div className={`box ${arrow_direction}`}>
                <img src={party} width="25px" /> Feature Coming Soon!
            </div>
        </div>

    )
}

export default ComingSoon;