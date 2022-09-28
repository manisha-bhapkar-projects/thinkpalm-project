import React from 'react';
import TabPane from './TabPane';
import Tabs from './Tabs';


const Specifics = (props) => {

    const stripHtml_fun = (a) => {
        let stripedHtml = a?.replace(/<[^>]+>/g, '');
        return stripedHtml;
    }

   
    let test_data = "No Specifics found...!";
    if (props.content_data != null) {
        const ListData = props.content_data[0].superTopicMetadatas.map((e,i) =>
        {
         
            let super_topic_temp = [];
            let sub_topic_temp = [];
            let topic_name = [];
            let  sub_topic_name = [];
            if(e.subcategorySettings.length>0){
                
                e.topics.forEach(v => {
                    topic_name.push(v.topicName)
                    if(v.subTopics.length>0){
                        v.subTopics.forEach(st => {
                            sub_topic_name.push(st.supertopicName);
                            sub_topic_temp.push(<div className="col-12">
                            <div className="round yellow_bg"></div>
                            <h3 dangerouslySetInnerHTML={{__html: stripHtml_fun(st.subTopicName)}}></h3>
                            <p dangerouslySetInnerHTML={{__html: stripHtml_fun(st.subTopicContent)}}></p>
                            </div>);
                        });
                    }
                    super_topic_temp.push(<div className="col-12">
                    <div className="round red_bg"></div>
                    <h3 dangerouslySetInnerHTML={{__html: stripHtml_fun(v.topicName)}}></h3>
                    <p dangerouslySetInnerHTML={{__html: stripHtml_fun(v.topicContent)}}></p>
                    {sub_topic_temp}
                    </div>);
                });
                // super_topic_temp = <>{super_topic_temp}</>
            }
           
           return( <TabPane name={e.supertopicName} topic_names_list={topic_name} sub_topic_names_list={sub_topic_name} key={i}>
                <div className="col-12">
                    <h3>{e.supertopicName}</h3>
                    <div className="round blue_bg">
                    </div>
                    <div>
                    <p dangerouslySetInnerHTML={{__html: stripHtml_fun(e.supertopicContent)}}></p>
                    </div>
                </div>
                {super_topic_temp}
                
            </TabPane>);
        }
        );
        test_data = ListData;

    }
 

    return (
        <React.Fragment>
            <Tabs>
                {test_data}
            </Tabs>
        </React.Fragment>
    )
}

export default Specifics;