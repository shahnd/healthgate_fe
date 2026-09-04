import { useNavigate } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";

export default function NoticeItemComponent(props) {

    // 실행할 구문
    let navigate = useNavigate();

    const item = props.item;

    // return 구문
    return (

        <TableRow key={item.noticeId} onClick={() => 
                navigate(`/notices/${ item.noticeId }`, { state: { isFromList: true } })}>
            <TableCell className="font-medium">{item.noticeId}</TableCell>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.employee.name}</TableCell>
            <TableCell>{item.createdAt?.substring(0, 10)}</TableCell>
            <TableCell>{item.count}</TableCell>
         </TableRow>
    );
}