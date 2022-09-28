import React from "react";

import SearchBar from "./searchBar"

const KnowledgeBaseHeader = (props) => {

    return (
        <div className={props.className} data-test="knowledge">
            <div className={props.insight ? "header-banner insights-banner" : props.bannerHeader ? `header-banner ${props.bannerHeader}` : props.doc_shop ? "header-banner doc-banner" : "header-banner"}>
                <div className="banner-image">
                    <SearchBar {...props} theme="dark" noRow param={props.param} />
                </div>
            </div>
        </div>
    );
};

export default React.memo(KnowledgeBaseHeader);
