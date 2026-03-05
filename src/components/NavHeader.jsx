import {useState} from 'react';
import '../css/NavHeader.css';
import { Button, Input, Select, Space } from 'antd';
import LoginAvatar from './LoginAvatar.jsx';
import { useNavigate } from 'react-router-dom';



function PageHeader(props) {
    const { Search } = Input;
    const options = [
        {
            value: 'issue',
            label: '问答',
        },
        {
            value: 'book',
            label: '书籍',
        },
    ];
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState("issue");

    function onSearch(value) {
        
            if(value){
            // 搜索框有内容，需要进行搜索操作
            navigate("/search", {
                state : {
                    value,
                    searchType
                }
            })
        } else {
            // 搜索框没有内容，跳转到首页
            navigate("/issues");
        }
        
    }

    function onChange(value) {
        setSearchType(value);
    }

    return (
        <div className='headerContainer'>
            {/* logo */}
            <div className='logoContainer'>
                <div className="logo">Asking</div>
            </div>
            {/* 搜索框 */}
            <div className='searchContainer'>
                <Space.Compact
                    style={{
                        width: '40%'
                    }}>
                    <Select defaultValue="issue" options={options} 
                    onChange={onChange}
                    />
                    <Input.Search
                        onSearch={onSearch}
                        placeholder="请输入要搜索的内容"
                        allowClear
                        enterButton="搜索"
                        size='large' />
                </Space.Compact>
            </div>
            {/* 登录 */}
            <div className='loginContainer'>
                <LoginAvatar loginHandle={props.loginHandle} />
            </div>

        </div>
    );
}

export default PageHeader;