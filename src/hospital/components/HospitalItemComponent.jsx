import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

export default function HospitalItemComponent(props) {

   // 실행할 구문
   let navigate = useNavigate();

   const item = props.item;

   console.log(item);

   return (
         // <tr onClick={ () => { navigate(`/hospitals/${ item.hospitalId }`);} }>
         //    <td>{ item.name }</td>
         //    <td>{ item.address }</td>
         //    <td>{ item.phone }</td>
         //    <td>
         //       <label>
         //       <input
         //          type="checkbox"
         //          checked={Boolean(item.generalExamAvailable)}
         //          readOnly
         //       />
         //       일반검진
         //       </label>
         //       <label>
         //       <input
         //          type="checkbox"
         //          checked={Boolean(item.stomachCancerExamAvailable)}
         //          readOnly
         //       />
         //       위암검진
         //       </label>
         //       <label>
         //       <input
         //          type="checkbox"
         //          checked={Boolean(item.colonCancerExamAvailable)}
         //          readOnly
         //       />
         //       대장암검진
         //       </label>
         //       <label>
         //       <input
         //          type="checkbox"
         //          checked={Boolean(item.liverCancerExamAvailable)}
         //          readOnly
         //       />
         //       간암검진
         //       </label>
         //       <label>
         //       <input
         //          type="checkbox"
         //          checked={Boolean(item.lungCancerExamAvailable)}
         //          readOnly
         //       />
         //       폐암검진
         //       </label>
         //    </td>
         // </tr>
         <TableRow key={item.hospitalId} onClick={() => navigate(`/hospitals/${item.hospitalId}`)}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.address}</TableCell>
            <TableCell>{item.phone}</TableCell>
            <TableCell>
               <div className="flex flex-wrap gap-x-3 gap-y-1">
                     <label className="flex items-center gap-1 text-sm">
                        <Checkbox checked={Boolean(item.generalExamAvailable)} disabled />
                        일반검진
                     </label>
                     <label className="flex items-center gap-1 text-sm">
                        <Checkbox checked={Boolean(item.stomachCancerExamAvailable)} disabled />
                        위암검진
                     </label>
                     <label className="flex items-center gap-1 text-sm">
                        <Checkbox checked={Boolean(item.colonCancerExamAvailable)} disabled />
                        대장암검진
                     </label>
                     <label className="flex items-center gap-1 text-sm">
                        <Checkbox checked={Boolean(item.liverCancerExamAvailable)} disabled />
                        간암검진
                     </label>
                     <label className="flex items-center gap-1 text-sm">
                        <Checkbox checked={Boolean(item.lungCancerExamAvailable)} disabled />
                        폐암검진
                     </label>
               </div>
            </TableCell>
         </TableRow>
   );
}
