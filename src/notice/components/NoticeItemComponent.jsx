import { useNavigate } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";

export default function NoticeItemComponent(props) {

    // 실행할 구문
    let navigate = useNavigate();

    // props = {item : {여기}};
    const item = props.item;

    // return 구문
    return (

        // <tr onClick={ () =>  { navigate(`/notices/${ item.noticeId }`); } }>
        // <td>{ item.noticeId }</td>
        // <td>{ item.title }</td>
        // <td>{ item.employee.name }</td>
        // <td>{ item.createdAt?.substring(0, 10) }</td>
        // <td>{ item.count }</td>
        // </tr>
        <TableRow key={item.noticeId} onClick={() => navigate(`/notices/${ item.noticeId }`)}>
            <TableCell className="font-medium">{item.noticeId}</TableCell>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.employee.name}</TableCell>
            <TableCell>{item.createdAt?.substring(0, 10)}</TableCell>
            <TableCell>{item.count}</TableCell>
         </TableRow>
    );
}