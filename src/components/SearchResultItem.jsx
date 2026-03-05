import React from 'react';
import IssuesItem from './IssuesItem';

function SearchResultItem(props) {
    return (
        <div>
            {
                props.issueInfo.title ? <IssuesItem info={props.issueInfo} /> : null
                
            }
        </div>
    );
}

export default SearchResultItem;