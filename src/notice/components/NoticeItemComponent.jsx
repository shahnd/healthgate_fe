import { useNavigate } from "react-router-dom";

export default function NoticeItemComponent(props) {

    // 실행할 구문
    let navigate = useNavigate();

    // props = {item : {여기}};
    const item = props.item;

    // return 구문
    return (
        <tr onClick={ () =>  { navigate(`/notice/detail/${ item.boticeId }`); } }>
            <td>{ item.noticeId }</td>
            <td>{ item.title }</td>
            <td>{ item.employee.id }</td>
            <td>{ item.createDate.substring(0, 10) }</td>
            <td>{ item.count }</td>
        </tr>
    );
}