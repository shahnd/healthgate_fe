import { useNavigate } from "react-router-dom";

export default function HospitalItemComponent(props) {

   // 실행할 구문
   let navigate = useNavigate();

   const item = props.item;

   console.log(item);

   return (
         <tr onClick={ () => { navigate(`/hospitals/${ item.hospitalId }`);} }>
            <td>{ item.name }</td>
            <td>{ item.address }</td>
            <td>{ item.phone }</td>
            <td>
               <label>
               <input
                  type="checkbox"
                  checked={Boolean(item.generalExamAvailable)}
                  readOnly
               />
               일반검진
               </label>
               <label>
               <input
                  type="checkbox"
                  checked={Boolean(item.stomachCancerExamAvailable)}
                  readOnly
               />
               위암검진
               </label>
               <label>
               <input
                  type="checkbox"
                  checked={Boolean(item.colonCancerExamAvailable)}
                  readOnly
               />
               대장암검진
               </label>
               <label>
               <input
                  type="checkbox"
                  checked={Boolean(item.liverCancerExamAvailable)}
                  readOnly
               />
               간암검진
               </label>
               <label>
               <input
                  type="checkbox"
                  checked={Boolean(item.lungCancerExamAvailable)}
                  readOnly
               />
               폐암검진
               </label>
            </td>
         </tr>
   );
}
